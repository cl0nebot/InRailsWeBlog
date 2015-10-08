RSpec.describe Tag, type: :model do

  before do
    @tag = Tag.create(
        name: 'Tag'
    )
  end

  subject { @tag }

  describe 'Article model', basic: true do
    it { is_expected.to be_valid }
  end

  describe '#name', basic: true do
    it { is_expected.to respond_to(:name) }
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_length_of(:name).is_at_least(1) }
    it { is_expected.to validate_length_of(:name).is_at_most(128) }
    it { is_expected.to validate_uniqueness_of(:name).case_insensitive }
    it { is_expected.to have_db_index(:name) }
    it { expect(@tag.name).to match 'Tag' }
  end

  context 'associations' do
    describe 'relations', basic: true do
      it { is_expected.to have_and_belong_to_many(:articles) }
    end
  end

end