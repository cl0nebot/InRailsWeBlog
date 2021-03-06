# frozen_string_literal: true

# == Schema Information
#
# Table name: tags
#
#  id                       :bigint(8)        not null, primary key
#  user_id                  :bigint(8)
#  name                     :string           not null
#  description_translations :jsonb
#  languages                :string           default([]), is an Array
#  synonyms                 :string           default([]), is an Array
#  color                    :string
#  notation                 :integer          default(0)
#  priority                 :integer          default(0)
#  visibility               :integer          default("everyone"), not null
#  accepted                 :boolean          default(TRUE), not null
#  archived                 :boolean          default(FALSE), not null
#  allow_comment            :boolean          default(TRUE), not null
#  pictures_count           :integer          default(0)
#  tagged_articles_count    :integer          default(0)
#  bookmarks_count          :integer          default(0)
#  comments_count           :integer          default(0)
#  slug                     :string
#  deleted_at               :datetime
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#

class Tag < ApplicationRecord

  # == Attributes ===========================================================
  include EnumsConcern
  enum visibility: VISIBILITY
  enums_to_tr('tag', [:visibility])

  include TranslationConcern
  # Add current_language to model
  translates :description,
             auto_strip_translation_fields:    [:description],
             fallbacks_for_empty_translations: true

  # Strip whitespaces
  auto_strip_attributes :name, :color

  delegate :popularity,
           :rank, :rank=,
           :home_page, :home_page=,
           to: :tracker, allow_nil: true

  # == Extensions ===========================================================
  # Versioning
  has_paper_trail on: [:update], only: [:name, :description_translations, :synonyms]

  # Track activities
  ## scopes: most_viewed, most_clicked, recently_tracked, populars, home
  include ActAsTrackedConcern
  acts_as_tracked :queries, :searches, :clicks, :views, callbacks: { click: :add_visit_activity }

  # Follow public activities
  include PublicActivity::Model
  tracked owner: :user

  # SEO
  include NiceUrlConcern
  friendly_id :slug_candidates, use: :slugged

  # Search
  searchkick searchable:  [:name, :description, :synonyms],
             word_middle: [:name, :description],
             suggest:     [:name],
             highlight:   [:name, :description],
             language:    -> { I18n.locale == :fr ? 'french' : 'english' }

  # Comments
  ## scopes: most_rated, recently_rated
  include CommentableConcern

  # Marked as deleted
  acts_as_paranoid

  # == Relationships ========================================================
  belongs_to :user,
             class_name:    'User',
             counter_cache: true

  has_many :tagged_articles,
           dependent: :destroy
  has_many :articles,
           through: :tagged_articles
  has_many :topics,
           through: :tagged_articles

  has_many :parent_relationships,
           autosave:    true,
           class_name:  'TagRelationship',
           foreign_key: 'parent_id',
           dependent:   :destroy
  has_many :children,
           -> { distinct },
           through: :parent_relationships,
           source:  :child

  has_many :child_relationships,
           autosave:    true,
           class_name:  'TagRelationship',
           foreign_key: 'child_id',
           dependent:   :destroy
  has_many :parents,
           -> { distinct },
           through: :child_relationships,
           source:  :parent

  has_one :icon,
          as:         :imageable,
          class_name: 'Picture',
          autosave:   true,
          dependent:  :destroy
  accepts_nested_attributes_for :icon,
                                allow_destroy: true,
                                reject_if:     lambda {
                                  |picture| picture['picture'].blank? && picture['image_tmp'].blank?
                                }

  has_many :bookmarks,
           as:          :bookmarked,
           class_name:  'Bookmark',
           foreign_key: 'bookmarked_id',
           dependent:   :destroy
  has_many :user_bookmarks,
           through: :bookmarks,
           source:  :user

  has_many :follower,
           -> { where(bookmarks: { follow: true }) },
           through: :bookmarks,
           source:  :user

  # has_many :activities,
  #          as:         :trackable,
  #          class_name: 'PublicActivity::Activity'
  has_many :user_activities,
           as:         :recipient,
           class_name: 'PublicActivity::Activity'

  # == Validations ==========================================================
  validates :user,
            presence: true

  validates :name,
            presence: true,
            length:   { minimum: CONFIG.tag_name_min_length, maximum: CONFIG.tag_name_max_length }
  validate :name_visibility
  validate :public_name_immutable,
           on: :update

  validates :description,
            allow_nil: true,
            length:    { minimum: CONFIG.tag_description_min_length, maximum: CONFIG.tag_description_max_length }

  validates :languages,
            presence: true,
            if:       -> { description.present? }

  validates :visibility,
            presence: true
  validate :public_visibility_immutable,
           on: :update

  # == Scopes ===============================================================
  scope :everyone_and_user, -> (user_id = nil) {
    where('tags.visibility = 0 OR (tags.visibility = 1 AND tags.user_id = :user_id)', user_id: user_id)
  }

  scope :with_visibility, -> (visibility) {
    where(visibility: (visibility.is_a?(String) ? Tag.visibilities[visibility] : visibility))
  }

  scope :from_user, -> (user_slug, current_user_id = nil) {
    from_user_id(User.find_by(slug: user_slug)&.id, current_user_id)
  }
  scope :from_user_id, -> (user_id = nil, current_user_id = nil) {
    where(user_id: user_id).where('tags.visibility = 0 OR (tags.visibility = 1 AND tags.user_id = :current_user_id)',
                                  current_user_id: current_user_id || user_id)
  }

  scope :for_topic, -> (topic_slug) {
    for_topic_id(Topic.find_by(slug: topic_slug)&.id)
  }
  scope :for_topic_id, -> (topic_id) {
    joins(:tagged_articles).merge(TaggedArticle.where(topic_id: topic_id)).distinct
  }

  scope :most_used, -> (limit = 20) { order('tagged_articles_count desc').limit(limit) }
  scope :least_used, -> (limit = 20) { order('tagged_articles_count asc').limit(limit) }

  scope :unused, -> {
    where(tagged_articles_count: 0).where('updated_at < :day', day: 1.day.ago)
  }

  scope :bookmarked_by_user, -> (user_id) {
    joins(:bookmarks).where(bookmarks: { bookmarked_type: model_name.name, user_id: user_id })
  }

  scope :include_element, -> { includes(:user, :parents, :children) }

  # == Callbacks ============================================================
  before_create :set_default_color

  after_commit :invalidate_tag_cache

  # == Class Methods ========================================================
  def self.parse_tags(tags, current_user_id)
    return [] unless tags.is_a?(Array) || !tags.empty?

    tags.map do |tag_properties|
      name, visibility = if tag_properties.is_a?(String)
                           tag_properties.split(',')
                         else
                           [tag_properties[:name], tag_properties[:visibility]]
                         end

      visibility           ||= 'everyone'
      attributes           = {
        name:       Sanitize.fragment(name),
        visibility: Tag.visibilities[visibility]
      }.compact
      attributes[:user_id] = current_user_id if visibility != 'everyone'

      Tag.find_by(attributes) || Tag.new(attributes.merge(user_id: current_user_id))
    end
  end

  def self.remove_unused_tags(tags)
    return Tag.none unless tags.is_a?(Array) || !tags.empty?

    tags.map do |tag|
      tag.destroy if tag.tagged_articles_count.zero?
    end
  end

  def self.as_json(tags, options = {})
    return nil unless tags

    serializer_options = {
      root: tags.is_a?(Tag) ? 'tag' : 'tags'
    }

    serializer_options.merge(scope:      options.delete(:current_user),
                             scope_name: :current_user) if options.has_key?(:current_user)

    serializer_options[tags.is_a?(Tag) ? :serializer : :each_serializer] = if options[:strict]
                                                                             TagStrictSerializer
                                                                           elsif options[:sample]
                                                                             TagSampleSerializer
                                                                           else
                                                                             TagSerializer
                                                                           end

    ActiveModelSerializers::SerializableResource.new(tags, serializer_options.merge(options)).as_json
  end

  def self.as_flat_json(tags, options = {})
    return nil unless tags

    as_json(tags, options)[tags.is_a?(Tag) ? :tag : :tags]
  end

  # == Instance Methods =====================================================
  def user?(user)
    self.user_id == user.id if user
  end

  def default_picture
    default_picture = ''

    picture = if self.icon
                self.icon.image.mini.url
              else
                default_picture
              end

    return AssetManifest.image_path(picture || default_picture)
  end

  def child_only_for_topic(topic_id)
    tagged_for_topic(topic_id).size <= tagged_as_child_for_topic(topic_id).size
  end

  def tagged_for_topic(topic_id)
    self.tagged_articles.map(&:topic_id).select { |id| id == topic_id }
  end

  def tagged_as_child_for_topic(topic_id)
    self.child_relationships.select { |relation| relation.topic_id == topic_id }
  end

  def parents_for_user(current_user_id)
    self.parents.select do |parent|
      parent.everyone? || (parent.only_me? && parent.user_id == current_user_id)
    end
  end

  def children_for_user(current_user_id)
    self.children.select do |child|
      child.everyone? || (child.only_me? && child.user_id == current_user_id)
    end
  end

  def bookmarked?(user)
    user ? user_bookmarks.include?(user) : false
  end

  def followed?(user)
    user ? follower.include?(user) : false
  end

  def slug_candidates
    if visibility != 'everyone' && user
      [
        [:name, user.pseudo]
      ]
    else
      [
        :name
      ]
    end
  end

  def search_data
    {
      id:                    id,
      user_id:               user_id,
      topic_ids:             topics.ids,
      name:                  name,
      description:           description,
      languages:             languages,
      synonyms:              synonyms,
      notation:              notation,
      priority:              priority,
      visibility:            visibility,
      archived:              archived,
      accepted:              accepted,
      created_at:            created_at,
      updated_at:            updated_at,
      rank:                  rank,
      popularity:            popularity,
      tagged_articles_count: tagged_articles_count,
      slug:                  slug
    }
  end

  # SEO
  def meta_description
    [self.name, self.description&.summary(60)].compact.join(I18n.t('helpers.colon'))
  end

  private

  def add_visit_activity(user_id = nil, parent_id = nil)
    return unless user_id

    user = User.find_by(id: user_id)
    return unless user

    user.create_activity(:visit, recipient: self, owner: user, params: { topic_id: parent_id })
  end

  def name_visibility
    return unless self.name.present? && name_changed?

    if Tag.where('visibility = 1 AND user_id = :user_id AND lower(name) = :name', user_id: self.user_id, name: self.name.mb_chars.downcase.to_s).exists?
      errors.add(:name, I18n.t('activerecord.errors.models.tag.already_exist'))
    elsif Tag.where('visibility = 0 AND lower(name) = :name', name: self.name.mb_chars.downcase.to_s).exists?
      errors.add(:name, I18n.t('activerecord.errors.models.tag.already_exist_in_public'))
    end
  end

  def public_name_immutable
    if self.everyone? && name_changed?
      errors.add(:name, I18n.t('activerecord.errors.models.tag.public_name_immutable'))
    end
  end

  def public_visibility_immutable
    if visibility_was == 'everyone' && visibility_changed?
      errors.add(:visibility, I18n.t('activerecord.errors.models.tag.public_visibility_immutable'))
    end
  end

  def set_default_color
    self.color = Setting.tag_color unless self.color
  end

  def invalidate_tag_cache
    Rails.cache.delete_matched('user_tags:*')
  end

end
