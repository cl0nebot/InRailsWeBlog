# == Schema Information
#
# Table name: pictures
#
#  id             :integer          not null, primary key
#  user_id        :integer          not null
#  imageable_id   :integer
#  imageable_type :string           not null
#  image          :string
#  image_tmp      :string
#  description    :text
#  copyright      :string
#  priority       :integer          default(0), not null
#  accepted       :boolean          default(TRUE), not null
#  deleted_at     :datetime
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

class Picture < ApplicationRecord

  # == Attributes ===========================================================
  auto_strip_attributes :description, :copyright

  # == Extensions ===========================================================
  mount_uploader :image, PictureUploader
  store_in_background :image

  # Marked as deleted
  acts_as_paranoid
  translation_class.send :acts_as_paranoid rescue nil

  # == Relationships ========================================================
  belongs_to :user

  belongs_to :imageable,
             polymorphic: true,
             touch: true,
             counter_cache: true

  # == Validations ==========================================================
  validates :user,
            presence: true

  validates :imageable_type,
            presence: true
  validates_integrity_of :image
  validates_processing_of :image
  validate :image_size

  # == Scopes ===============================================================

  # == Callbacks ============================================================

  # == Class Methods ========================================================

  # == Instance Methods =====================================================
  def user?(user)
    user ? user.id == self.user.id : false
  end

  def format_attributes(attributes={})
    # Imageable
    unless attributes[:model_id].blank?
      self.imageable_id = attributes.delete(:model_id).to_i
    end
    unless attributes[:model].blank?
      self.imageable_type = attributes.delete(:model).strip.classify
    end

    unless attributes[:description].nil?
      self.description = Sanitize.fragment(attributes.delete(:description))
    end
    unless attributes[:copyright].nil?
      self.copyright = Sanitize.fragment(attributes.delete(:copyright))
    end

    # Pictures
    unless attributes[:file].blank?
      self.image = attributes.delete(:file)
    end

    unless attributes[:process_now].nil?
      self.process_image_upload = !!attributes.delete(:process_now)
    end

    self.assign_attributes(attributes)
  end

  private

  def image_size
    if image.size > CONFIG.image_size
      errors.add(:image, I18n.t('activerecord.errors.models.picture.image_size'))
    end
  end

end
