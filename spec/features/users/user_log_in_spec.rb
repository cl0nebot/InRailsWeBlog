# Not working in global mode
# feature 'Log in', advanced: true, js: true do
#
#   scenario 'user cannot log in if not registered' do
#     login_with('test@example.com', 'please123')
#     expect(page).to have_content t('devise.failure.not_found_in_database', authentication_keys: 'test@example.com')
#   end
#
#   # Not used
#   # scenario 'user cannot log in with a not validated account even if credentials are valid' do
#   #   user = FactoryBot.create(:user, not_confirmed: true)
#   #   user.update_attributes(confirmation_sent_at: Time.zone.now - 4.days)
#   #   login_with(user.email, user.password)
#   #   expect(page).to have_content t('devise.failure.unconfirmed')
#   # end
#
#   scenario 'user cannot log in with wrong email' do
#     user = FactoryBot.create(:user, not_confirmed: true)
#     login_with('invalid@email.com', user.password)
#     expect(page).to have_content t('devise.failure.not_found_in_database', authentication_keys: 'invalid@email.com')
#   end
#
#   scenario 'user cannot log in with wrong password' do
#     user = FactoryBot.create(:user, not_confirmed: true)
#     login_with(user.email, 'invalidpass')
#     expect(page).to have_content t('devise.failure.invalid', authentication_keys: user.email)
#   end
#
#   # Not working, incorrect user !
#   # scenario 'user can log in with his email and a validated account' do
#   #   user = FactoryBot.create(:user)
#   #   login_with(user.email, user.password)
#   #   sleep 20
#   #   expect(page).to have_content t('devise.sessions.signed_in')
#   # end
#
#   # Not working, incorrect user !
#   # scenario 'user can log in with his pseudo and a validated account' do
#   #   user = FactoryBot.create(:user)
#   #   login_with(user.pseudo, user.password)
#   #   expect(page).to have_content t('devise.sessions.signed_in')
#   # end
#
#   # scenario 'user is redirected to his profile by default after successful login' do
#   #   user = FactoryBot.create(:user)
#   #   login_with(user.email, user.password)
#   #   expect(current_path).to eq(root_path(user.slug))
#   # end
#
#   # Not working, incorrect user !
#   # scenario 'user is redirected to login page if he requests a protected page' do
#   #   visit users_path
#   #   expect(current_path).to eq(login_path)
#   # end
#
#   # Not working, incorrect user !
#   # scenario 'user is redirected to the requested page if exists' do
#   #   user = FactoryBot.create(:user)
#   #   visit edit_user_path(user)
#   #   within('#login_user') do
#   #     fill_in t('user.model.pseudo'), with: user.email
#   #     fill_in t('user.model.password'), with: user.password
#   #     click_button t('views.user.login.submit')
#   #   end
#   #   expect(current_path).to eq(edit_user_path(user))
#   # end
#
#   scenario 'user can access to his account with a nice url format' do
#     user = FactoryBot.create(:user)
#     login_with(user.email, user.password)
#     visit user_path(user)
#     expect(current_path).to match(/\/person-\d+/)
#   end
#
#   # Not working, incorrect user !
#   # scenario 'confirmed user can see a flash message confirming his connection' do
#   #   user = FactoryBot.create(:user)
#   #   login_with(user.email, user.password)
#   #   expect(page).to have_content t('devise.sessions.signed_in')
#   # end
#
#   # scenario 'visitor can see a pop-up to log in' do
#   #   user = FactoryBot.create(:user)
#   #   I18n.locale = 'fr'
#   #
#   #   visit root_path
#   #
#   #   page.find('#toggle-navbar').click
#   #   click_link(t('views.header.log_in'), match: :first, visible: false)
#   #   sleep 1
#   #
#   #   expect(page).to have_css '#login_module.modal'
#   #   expect(page).to have_content /#{t('views.user.login.title')}/i
#   #
#   #   within('.modal-content') do
#   #     fill_in t('user.model.login'), with: user.pseudo
#   #     fill_in t('user.model.password'), with: user.password
#   #     click_button t('views.user.login.submit')
#   #   end
#   #
#   #   sleep 1
#   #   expect(current_path).to eq(root_user_path(user.slug))
#   # end
#
# end
