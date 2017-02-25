require 'rails_helper'

RSpec.describe ArticleRelationship, type: :model do

  before(:all) do
    @user  = create(:user)
    @topic = create(:topic, user: @user)

    @parent_article = create(:article, user: @user)
    @child_article  = create(:article, user: @user)
  end

  before do
    @article_relation = ArticleRelationship.create(
      user:   @user,
      parent: @parent_article,
      child:  @child_article
    )
  end

  subject { @article_relation }

  context 'Object', basic: true do
    it { is_expected.to be_valid }
  end

  context 'Associations', basic: true do
    it { is_expected.to belong_to(:user) }

    it { is_expected.to belong_to(:parent) }
    it { is_expected.to belong_to(:child) }

    it { is_expected.to validate_presence_of(:user) }

    it { is_expected.to validate_presence_of(:parent) }
    it { is_expected.to validate_presence_of(:child) }

    it { is_expected.to validate_uniqueness_of(:parent_id).scoped_to([:user_id, :child_id]) }
  end

end