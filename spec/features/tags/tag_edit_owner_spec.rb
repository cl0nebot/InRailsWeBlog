# frozen_string_literal: true

feature 'Tag edit for owners', advanced: true, js: true do

  background(:all) do
    @user       = create(:user)
    @other_user = create(:user)

    @topic = create(:topic, user: @user)

    @tags     = create_list(:tag, 2, user: @user)
  end

  given(:tag_page) { TagPage.new("/tags/#{@tags.first.slug}/edit") }

  background do
    login_as(@user, scope: :user, run_callbacks: false)
    tag_page.visit
  end

  subject { tag_page }

  feature 'owner can see the page' do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
          current_page: tag_page,
          title:        I18n.t('views.tag.edit.title', name: @tags.first.name),
          asset_name:   'assets/user',
          common_js:    ['assets/runtime', 'assets/user'],
          connected:    true
        }
      }
    end

    scenario 'page has a valid HTML structure' do
      is_expected.to have_valid_html
    end
  end

  feature 'Tag edit content for owner' do
    scenario 'owner can edit the tags' do
      is_expected.to have_css('input#tag_name')
      is_expected.to have_css('.note-editor.note-frame')
    end

    scenario 'users can see the topic sidebar' do
      is_expected.to have_css("ul[class*='TagSidebar-root-']")
    end
  end

end
