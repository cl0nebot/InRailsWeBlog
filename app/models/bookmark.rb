# == Schema Information
#
# Table name: bookmarks
#
#  id              :integer          not null, primary key
#  user_id         :integer          not null
#  bookmarked_type :string           not null
#  bookmarked_id   :integer          not null
#  follow          :boolean          default(FALSE)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class Bookmark < ApplicationRecord

  # == Attributes ===========================================================

  # == Extensions ===========================================================
  include PublicActivity::Model
  tracked owner: :user, recipient: :article

  # == Relationships ========================================================
  belongs_to :user

  belongs_to :bookmarked,
             polymorphic:   true,
             counter_cache: true

  # == Validations ==========================================================
  validates :user_id,
            presence: true

  validates :bookmarked_id,
            :bookmarked_type,
            presence: true

  validates_uniqueness_of :user_id,
                          scope: [:bookmarked_id, :bookmarked_type],
                          allow_nil: false

  # == Scopes ===============================================================
  scope :users, -> { where(bookmarked_type: 'User').includes(:bookmarked) }
  scope :articles, -> { where(bookmarked_type: 'Article').includes(:bookmarked) }
  scope :tags, -> { where(bookmarked_type: 'Tag').includes(:bookmarked) }

  # == Callbacks ============================================================

  # == Class Methods ========================================================

  # == Instance Methods =====================================================

end
