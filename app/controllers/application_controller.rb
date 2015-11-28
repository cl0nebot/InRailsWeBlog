class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  ensure_security_headers(csp: false)

  include Pundit
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  def w(msg)
    Rails.logger.ap msg, :warn
  end

  before_filter :configure_permitted_parameters, if: :devise_controller?
  before_action :set_locale

  def set_locale
    I18n.locale         =
      if params[:locale].present?
        session[:locale] = params[:locale]
        params[:locale]
      elsif session[:locale].present?
        session[:locale]
      elsif current_user
        current_user.locale
      elsif request.location.present? && !request.location.country_code.empty?
        if %w(FR BE CH).any? { |country_code| request.location.country_code.upcase == country_code }
          :fr
        else
          :en
        end
      else
        http_accept_language.compatible_language_from(I18n.available_locales)
      end

    current_user.locale = I18n.locale if current_user && current_user.locale.to_s != I18n.locale.to_s
  end

  # Redirection when Javascript is used.
  # +flash_type+ parameters:
  #  success
  #  error
  #  alert
  #  notice
  def js_redirect_to(path, flash_type = nil, flash_message = nil)
    if flash_type
      flash[flash_type] = flash_message
      flash.keep(flash_type)
    end

    render js: %(window.location.href='#{path}') and return
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_up) do |u|
      u.permit :pseudo, :email, :password, :password_confirmation
    end
    devise_parameter_sanitizer.for(:sign_in) do |u|
      u.permit(:login, :pseudo, :email, :password, :remember_me)
    end
    devise_parameter_sanitizer.for(:account_update) do |u|
      u.permit(:pseudo, :email, :password, :password_confirmation, :current_password)
    end
  end

  def user_not_authorized(exception)
    # Clear the previous response body to avoid a DoubleRenderError when redirecting or rendering another view
    self.response_body = nil

    policy_name = exception.policy.class.to_s.underscore
    policy_type = exception.query

    flash.now[:alert] = t "#{policy_name}.#{policy_type}", scope: 'pundit', default: :default

    respond_to do |format|
      format.js { js_redirect_to(ERB::Util.html_escape(request.referrer) || root_path) }
      format.html { redirect_to(ERB::Util.html_escape(request.referrer) || root_path) }
      format.json { render json: { error: I18n.t('pundit.default') }.to_json, status: :forbidden }
    end
  end

  def authenticate_user!(options = {})
    if user_signed_in?
      super(options)
    else
      store_location
      redirect_to login_path, notice: I18n.t('devise.failure.unauthenticated')
      ## if you want render 404 page
      ## render :file => File.join(Rails.root, 'public/404'), :formats => [:html], :status => 404, :layout => false
    end
  end

  def previous_url(url)
    if url &&
      !url.include?('/users/sign_in') &&
      !url.include?('/login') &&
      !url.include?('/users/sign_up') &&
      !url.include?('/signup') &&
      !url.include?('/users/password/new') &&
      !url.include?('/users/password/edit') &&
      !url.include?('/users/confirmation') &&
      !url.include?('/users/validation') &&
      !url.include?('/users/logout') &&
      !url.include?('/users/sign_out')
      return url
    end
  end

  def after_sign_in_path_for(resource)
    previous_url = previous_url(request.referrer)

    if !session[:previous_url] && request.referrer && request.referrer.include?(root_url) && previous_url
      session[:previous_url] = request.referrer
    end

    session[:previous_url] || root_user_path(current_user)
  end

  def store_location
    return unless request.get?

    session[:previous_url] = previous_url(request.path) unless request.xhr? # don't store ajax calls
  end
end
