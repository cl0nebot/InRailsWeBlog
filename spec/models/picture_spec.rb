# == Schema Information
#
# Table name: pictures
#
#  id                 :integer          not null, primary key
#  user_id            :integer          not null
#  imageable_id       :integer
#  imageable_type     :string           not null
#  image              :string
#  image_tmp          :string
#  priority           :integer          default(0), not null
#  accepted           :boolean          default(TRUE), not null
#  deleted_at         :datetime
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  image_secure_token :string
#  original_filename  :string
#

RSpec.describe Picture, type: :model do

  before(:all) do
    @user = create(:user)
  end

  before do
    @picture = Picture.create(
      user:               @user,
      imageable_type:     'Article',
      description:        'Picture description',
      copyright:          'Picture copyright',
      image:              'my_image.jpg',
      image_tmp:          'my_tmp_image',
      priority:           10,
      accepted:           true,
      image_secure_token: '12aa100f-4514-4a48-b1a0-51eece8f35f7',
      original_filename:  'image_original_filename.jpg'
    )
  end

  subject { @picture }

  context 'Object', basic: true do
    it { is_expected.to be_valid }
  end

  context 'Attributes', basic: true do
    it { is_expected.to respond_to(:imageable_id) }
    it { is_expected.to respond_to(:imageable_type) }
    it { is_expected.to respond_to(:description) }
    it { is_expected.to respond_to(:copyright) }
    it { is_expected.to respond_to(:image) }
    it { is_expected.to respond_to(:image_tmp) }
    it { is_expected.to respond_to(:priority) }
    it { is_expected.to respond_to(:accepted) }
    it { is_expected.to respond_to(:image_secure_token) }
    it { is_expected.to respond_to(:original_filename) }

    it { expect(@picture.imageable_type).to match('Article') }
    it { expect(@picture.description).to match('Picture description') }
    it { expect(@picture.copyright).to match('Picture copyright') }
    it { expect(@picture.image).to be_a(PictureUploader) }
    it { expect(@picture.image_tmp).to match('my_tmp_image') }
    it { expect(@picture.priority).to eq(10) }
    it { expect(@picture.accepted).to be true }
    it { expect(@picture.image_secure_token).to eq('12aa100f-4514-4a48-b1a0-51eece8f35f7') }
    it { expect(@picture.original_filename).to eq('image_original_filename.jpg') }

    describe '#user' do
      it { is_expected.to validate_presence_of(:user) }
      it { is_expected.to have_db_index(:user_id) }
    end

    describe '#imageable' do
      it { is_expected.to validate_presence_of(:imageable_type) }
      it { is_expected.to have_db_index([:imageable_id, :imageable_type]) }
    end

    # describe '.image_size', basic: true do
    #   it { is_expected.to allow_value(image).for(:image).with_message(I18n.t('activerecord.errors.models.picture.image_size')) }
    # end

    describe 'Default Attributes', basic: true do
      before do
        @picture = Picture.create(
          imageable_type: 'Article',
          image:          'my_image.jpg',
          image_tmp:      'my_tmp_image'
        )
      end

      it { expect(@picture.priority).to eq(0) }
      it { expect(@picture.accepted).to be true }
    end
  end

  context 'Translations', basic: true do
    describe 'translates description' do
      it { is_expected.to transcribe(:description, [:en, :fr]) }
      it { is_expected.to fallback(:description, :en, :fr) }

      it { is_expected.to transcribe(:copyright, [:en, :fr]) }
      it { is_expected.to fallback(:copyright, :en, :fr) }
    end
  end

  context 'Properties', basic: true do
    it { is_expected.to have_uploader(:image) }
    it { is_expected.to have_strip_attributes([:description, :copyright]) }
  end

  context 'Associations', basic: true do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:imageable) }
  end

  context 'Instance Methods', basic: true do
    describe '.user?' do
      it { is_expected.to respond_to(:user?) }
      it { expect(@picture.user?(@user)).to be true }
      it { expect(@picture.user?(create(:user))).to be false }
    end

    describe '.format_attributes' do
      it { is_expected.to respond_to(:format_attributes) }

      it 'format attributes' do
        picture_attributes = {
          model_id:    1,
          model:       'Article',
          description: 'Image description',
          copyright:   'Image copyright',
          file:        'image.jpg',
        }

        picture = Picture.new
        picture.format_attributes(picture_attributes)

        expect(picture.imageable_id).to eq(1)
        expect(picture.imageable_type).to eq('Article')
        expect(picture.description).to eq('Image description')
        expect(picture.copyright).to eq('Image copyright')
        expect(@picture.image).to be_a(PictureUploader)
      end
    end
  end

end
