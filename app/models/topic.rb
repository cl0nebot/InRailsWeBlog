# frozen_string_literal: true
# == Schema Information
#
# Table name: topics
#
#  id                       :bigint(8)        not null, primary key
#  user_id                  :bigint(8)
#  name                     :string           not null
#  description_translations :jsonb
#  languages                :string           default([]), is an Array
#  color                    :string
#  priority                 :integer          default(0), not null
#  visibility               :integer          default("everyone"), not null
#  accepted                 :boolean          default(TRUE), not null
#  archived                 :boolean          default(FALSE), not null
#  pictures_count           :integer          default(0)
#  articles_count           :integer          default(0)
#  bookmarks_count          :integer          default(0)
#  slug                     :string
#  deleted_at               :datetime
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  settings                 :jsonb            not null
#  mode                     :integer          default("default"), not null
#

class Topic < ApplicationRecord

  # == Attributes ===========================================================
  include EnumsConcern
  enum mode: TOPIC_MODE
  enum visibility: VISIBILITY
  enums_to_tr('topic', [:mode, :visibility])

  include TranslationConcern
  # Add current_language to model
  translates :description,
             auto_strip_translation_fields:    [:description],
             fallbacks_for_empty_translations: true

  # Store settings
  include Storext.model
  # Settings are inherited from user
  store_attributes :settings do
    # Not used for now
    # articles_loader String, default: nil # Load articles by: all / paginate / infinite
    # article_display String, default: nil # Display articles: inline / card (with inline edit) / grid

    # tag_sidebar_with_child Boolean, default: nil # Display child only tags in sidebar
    # tag_order String, default: 'name' # Order tags by: name, priority_asc, priority_desc, id_asc, id_desc, created_asc, created_desc, updated_asc, updated_desc, rank_asc, rank_desc, popularity_asc, popularity_desc, default
    # tag_parent_and_child Boolean, default: nil # Display child articles for parent tag

    tag_sidebar_pin Boolean, default: nil # Tag sidebar pinned by default

    article_order String, default: nil # Order articles by: priority_asc, priority_desc, id_asc, id_desc, created_asc, created_desc, updated_asc, updated_desc, tag_asc, tags_desc, rank_asc, rank_desc, popularity_asc, popularity_desc, default
  end

  # Strip whitespaces
  auto_strip_attributes :name, :color

  # == Extensions ===========================================================
  # Versioning
  has_paper_trail on: [:update], only: [:name, :description_translations]

  # Track activities
  ## scopes: most_viewed, most_clicked, recently_tracked, populars, home
  include ActAsTrackedConcern
  acts_as_tracked :queries, :searches, :clicks, :views, callbacks: { click: :add_visit_activity }

  # Follow public activities
  include PublicActivity::Model
  tracked owner: :user

  include FriendlyId
  friendly_id :slug_candidates, scope: :user, use: [:slugged, :scoped]

  # Search
  searchkick searchable:  [:name, :description],
             word_middle: [:name, :description],
             suggest:     [:name],
             highlight:   [:name, :description],
             language:    -> { I18n.locale == :fr ? 'french' : 'english' }

  # Marked as deleted
  acts_as_paranoid

  # == Relationships ========================================================
  belongs_to :user,
             counter_cache: true

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

  has_many :articles,
           dependent: :destroy

  has_many :tagged_articles,
           dependent: :destroy
  has_many :tag_relationships,
           dependent: :destroy
  has_many :tags,
           through: :tagged_articles

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

  has_many :user_activities,
           as:         :recipient,
           class_name: 'PublicActivity::Activity'

  has_many :shares,
           as:          :shareable,
           class_name:  'Share',
           foreign_key: 'shareable_id',
           dependent:   :destroy
  has_many :contributors,
           through: :shares,
           source:  :contributor

  # == Validations ==========================================================
  validates :user,
            presence: true

  validates :name,
            length: { minimum: CONFIG.topic_name_min_length, maximum: CONFIG.topic_name_max_length }
  validates_uniqueness_of :name,
                          scope:      :user_id,
                          conditions: -> { with_deleted },
                          message:    I18n.t('activerecord.errors.models.topic.already_exist')

  validates :description,
            length:    { minimum: CONFIG.topic_description_min_length, maximum: CONFIG.topic_description_max_length },
            allow_nil: true

  validates :languages,
            presence: true,
            if:       -> { description.present? }

  validates :mode,
            presence: true

  validates :visibility,
            presence: true

  validates :slug,
            presence:   true,
            uniqueness: { scope:          :user,
                          case_sensitive: false }

  # == Scopes ===============================================================
  scope :everyone_and_user, -> (user_id = nil) {
    where('topics.visibility = 0 OR (topics.visibility = 1 AND topics.user_id = :user_id)',
          user_id: user_id)
  }

  scope :with_visibility, -> (visibility) {
    where(visibility: (visibility.is_a?(String) ? Topic.visibilities[visibility] : visibility))
  }

  scope :from_user, -> (user_id = nil, current_user_id = nil) {
    where(user_id: user_id).where('topics.visibility = 0 OR (topics.visibility = 1 AND topics.user_id = :current_user_id)',
                                  current_user_id: current_user_id)
  }

  scope :bookmarked_by_user,
        -> (user_id) { joins(:bookmarks).where(bookmarks: { bookmarked_type: model_name.name, user_id: user_id }) }

  # == Callbacks ============================================================
  before_create :set_default_color

  after_update :regenerate_article_slug

  after_commit :invalidate_topic_cache

  # == Class Methods ========================================================
  def self.as_json(topics, options = {})
    return nil unless topics

    serializer_options = {
      root: topics.is_a?(Topic) ? 'topic' : 'topics'
    }

    serializer_options.merge(scope:      options.delete(:current_user),
                             scope_name: :current_user) if options.has_key?(:current_user)

    serializer_options[topics.is_a?(Topic) ? :serializer : :each_serializer] = if options[:strict]
                                                                                 TopicStrictSerializer
                                                                               elsif options[:sample]
                                                                                 TopicSampleSerializer
                                                                               else
                                                                                 TopicSerializer
                                                                               end

    ActiveModelSerializers::SerializableResource.new(topics, serializer_options.merge(options)).as_json
  end

  def self.as_flat_json(topics, options = {})
    return nil unless topics

    as_json(topics, options)[topics.is_a?(Topic) ? :topic : :topics]
  end

  # == Instance Methods =====================================================
  def user?(user)
    self.user_id == user.id if user
  end

  def bookmarked?(user)
    user ? user_bookmarks.include?(user) : false
  end

  def followed?(user)
    user ? follower.include?(user) : false
  end

  def slug_candidates
    [
      :name
    ]
  end

  def mode_translated
    mode_to_tr
  end

  def search_data
    {
      id:              id,
      user_id:         user_id,
      mode:            mode,
      mode_translated: mode_translated,
      name:            name,
      description:     description,
      languages:       languages,
      priority:        priority,
      visibility:      visibility,
      archived:        archived,
      accepted:        accepted,
      created_at:      created_at,
      updated_at:      updated_at,
      slug:            slug
    }
  end

  # SEO
  def meta_description
    [self.name, self.description.summary(60)].join(I18n.t('helpers.colon'))
  end

  private

  def add_visit_activity(user_id = nil, _parent_id = nil)
    return unless user_id

    user = User.find_by(id: user_id)
    return unless user

    user.create_activity(:visit, recipient: self, owner: user)
  end

  def set_default_color
    self.color = Setting.topic_color unless self.color
  end

  def regenerate_article_slug
    if name_previous_change
      self.articles.find_in_batches(batch_size: 200) do |articles|
        articles.each do |article|
          article.slug = nil
          article.save!
        end
      end
    end
  end

  def invalidate_topic_cache
    Rails.cache.delete("user_topics:#{self.user_id}")
  end

end
