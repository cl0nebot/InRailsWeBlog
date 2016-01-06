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

class UsersController < ApplicationController
  before_action :authenticate_user!, except: [:show, :validation]
  after_action :verify_authorized, except: [:index, :show, :validation]

  skip_before_action :set_locale, only: [:validation]

  include TrackerConcern

  respond_to :html, :json

  def index
    users = User.all

    render :index, locals: { users: users }
  end

  def show
    user = User.friendly.find(params[:id])

    User.track_views(user.id)

    render :show, locals: { user: user, mode: nil }
  end

  def bookmarks
    user = User.friendly.find(params[:id])
    authorize user

    render :show, locals: { user: user, mode: 'bookmark' }
  end

  def temporary
    user = User.friendly.find(params[:id])
    authorize user

    render :show, locals: { user: user, mode: 'temporary' }
  end

  def preferences
    user = User.find(params[:id])
    authorize user

    respond_to do |format|
      format.html { render json: user, serializer: PreferenceSerializer, content_type: 'application/json' }
      format.json { render json: user, serializer: PreferenceSerializer }
    end
  end

  def update_preferences
    user = User.find(params[:id])
    authorize user

    if params[:preferences]
      params[:preferences].each do |pref_type, pref_value|
        if pref_value == 'true'
          pref_value = true
        elsif pref_value == 'false'
          pref_value = false
        end
        user.preferences[pref_type.downcase.to_sym] = pref_value
      end
      user.save
    end

    respond_to do |format|
      format.html { render json: user, serializer: PreferenceSerializer, content_type: 'application/json' }
      format.json { render json: user, serializer: PreferenceSerializer }
    end
  end

  def edit
    user = User.friendly.find(params[:id])
    authorize user

    render :edit, locals: { user: user }
  end

  def update
    user = User.friendly.find(params[:id])
    authorize user

    if user.update_without_password(user_params)
      flash.now[:success] = t('views.user.flash.successful_update')
      redirect_to root_user_path(user)
    else
      flash.now[:error] = t('views.user.flash.error_update')
      render :edit, locals: { user: user }
    end
  end

  def validation
    user = {}

    if params[:user]
      user[:pseudo] = User.pseudo?(user_validation_params[:pseudo]) if user_validation_params[:pseudo]
      user[:email] = User.email?(user_validation_params[:email]) if user_validation_params[:email]
      user[:login] = User.login?(user_validation_params[:login]) if user_validation_params[:login]
    end

    respond_to do |format|
      format.json { render json: { user: user } }
      format.html { render json: { user: user } }
    end
  end

  private
  def user_params
    params.require(:user).permit(:first_name,
                                 :last_name,
                                 :age,
                                 :city,
                                 :country,
                                 :additional_info)
  end

  def user_validation_params
    params.require(:user).permit(:login,
                                 :pseudo,
                                 :email,
                                 :password,
                                 :remember_me)
  end
end
