# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  pseudo                 :string           default(""), not null
#  first_name             :string           default("")
#  last_name              :string           default("")
#  age                    :integer          default(0)
#  city                   :string           default("")
#  country                :string           default("")
#  additional_info        :string           default("")
#  locale                 :string           default("fr")
#  preferences            :text             default({}), not null
#  admin                  :boolean          default(FALSE), not null
#  slug                   :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default(0), not null
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :inet
#  last_sign_in_ip        :inet
#  confirmation_token     :string
#  confirmed_at           :datetime
#  confirmation_sent_at   :datetime
#  unconfirmed_email      :string
#  failed_attempts        :integer          default(0), not null
#  unlock_token           :string
#  locked_at              :datetime
#

class User < ActiveRecord::Base

  # User
  def to_s
    "I am #{pseudo}"
  end

  # Parameters validation
  validates :pseudo,
            presence:   true,
            uniqueness: { case_sensitive: false },
            length:     { minimum: 3, maximum: 50 }
  validates :email,
            length: { maximum: 128 }

  # Associations
  ## Articles
  has_many :articles,
           class_name:  'Article',
           foreign_key: 'author_id',
           dependent:   :destroy
  has_many :temporary_articles,
           -> { where temporary: true },
           class_name:  'Article',
           foreign_key: 'author_id'
  has_many :bookmarked_articles
  has_many :bookmarks,
           through: :bookmarked_articles,
           source:  :article

  ## Comment
  has_many :comments, as: :commentable,
           dependent:   :destroy

  ## Picture
  has_one :picture, as: :imageable,
          autosave:     true,
          dependent:    :destroy
  accepts_nested_attributes_for :picture,
                                allow_destroy: true,
                                reject_if:     lambda {
                                  |picture| picture['image'].blank? && picture['image_tmp'].blank?
                                }

  # Authentification
  attr_accessor :login
  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         :trackable,
         :validatable,
         :lockable,
         :confirmable,
         authentication_keys: [:login]

  def self.pseudo?(pseudo)
    User.exists?(['lower(pseudo) = ?', pseudo.downcase])
  end

  def self.email?(email)
    User.exists?(['lower(email) = ?', email.downcase])
  end

  def self.login?(login)
    User.pseudo?(login) || User.email?(login)
  end

  def self.find_for_database_authentication(warden_conditions)
    conditions = warden_conditions.dup
    login      = conditions.delete(:login)
    if login
      where(conditions.to_h).where(['lower(pseudo) = :value OR lower(email) = :value', { value: login.downcase }]).first
    else
      where(conditions.to_h).first
    end
  end

  # Nice url format
  include NiceUrlConcern
  friendly_id :pseudo, use: :slugged

  # Preferences
  store :preferences, accessors: [:article_display, :multi_language, :search_highlight, :search_operator, :search_exact], coder: JSON

  before_create do
    self.preferences[:article_display]  = CONFIG.article_display if preferences[:article_display].blank?
    self.preferences[:multi_language]   = CONFIG.multi_language if preferences[:multi_language].blank?
    self.preferences[:search_highlight] = CONFIG.search_highlight if preferences[:search_highlight].blank?
    self.preferences[:search_operator]  = CONFIG.search_operator if preferences[:search_operator].blank?
    self.preferences[:search_exact]     = CONFIG.search_exact if preferences[:search_exact].blank?
  end

  # Track activities
  include ActAsTrackedConcern
  acts_as_tracked :queries, :comments, :bookmarks, :clicks, :views

end
