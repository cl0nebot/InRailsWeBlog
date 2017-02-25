# == Schema Information
#
# Table name: trackers
#
#  id              :integer          not null, primary key
#  tracked_id      :integer          not null
#  tracked_type    :string           not null
#  views_count     :integer          default(0), not null
#  queries_count   :integer          default(0), not null
#  searches_count  :integer          default(0), not null
#  comments_count  :integer          default(0), not null
#  clicks_count    :integer          default(0), not null
#  bookmarks_count :integer          default(0), not null
#  rank            :integer          default(0), not null
#  home_page       :boolean          default(FALSE), not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

RSpec.describe Tracker, type: :model do

  before(:all) do
    @user = create(:user)
    @ride = create(:ride, :hiking_rideable, explorer: @user)
  end

  before do
    @tracker = Tracker.create(
      tracked:        @ride,
      views_count:    10,
      queries_count:  20,
      searches_count: 30,
      comments_count: 40,
      clicks_count:   50,
      rank:           5,
      home_page:      true,
      popularity:     10
    )
  end

  subject { @tracker }

  context 'Object', basic: true do
    it { is_expected.to be_valid }
  end

  context 'Attributes', basic: true do
    it { is_expected.to respond_to(:views_count) }
    it { is_expected.to respond_to(:queries_count) }
    it { is_expected.to respond_to(:searches_count) }
    it { is_expected.to respond_to(:comments_count) }
    it { is_expected.to respond_to(:clicks_count) }
    it { is_expected.to respond_to(:rank) }
    it { is_expected.to respond_to(:home_page) }
    it { is_expected.to respond_to(:popularity) }

    it { expect(@tracker.views_count).to eq(10) }
    it { expect(@tracker.queries_count).to eq(20) }
    it { expect(@tracker.searches_count).to eq(30) }
    it { expect(@tracker.comments_count).to eq(40) }
    it { expect(@tracker.clicks_count).to eq(50) }
    it { expect(@tracker.rank).to eq(5) }
    it { expect(@tracker.home_page).to be true }
    it { expect(@tracker.popularity).to eq(10) }

    describe 'Default Attributes', basic: true do
      before do
        @tracker = Tracker.create(tracked: @ride)
      end

      it { expect(@tracker.views_count).to eq(0) }
      it { expect(@tracker.queries_count).to eq(0) }
      it { expect(@tracker.searches_count).to eq(0) }
      it { expect(@tracker.comments_count).to eq(0) }
      it { expect(@tracker.clicks_count).to eq(0) }
      it { expect(@tracker.rank).to eq(0) }
      it { expect(@tracker.home_page).to be false }
      it { expect(@tracker.popularity).to eq(0) }
    end
  end

  context 'Associations', basic: true do
    it { is_expected.to belong_to(:tracked) }

    it { is_expected.to have_db_index([:tracked_id, :tracked_type]) }
  end

  context 'Instance Methods', basic: true do
    describe '.bookmarks_count' do
      it { is_expected.to respond_to(:bookmarks_count) }
    end
  end

end
