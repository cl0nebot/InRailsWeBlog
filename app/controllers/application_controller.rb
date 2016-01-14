class ApplicationController < ActionController::Base
  # Security
  protect_from_forgery with: :exception
  ensure_security_headers(csp: false)

  # Pundit
  include Pundit
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  rescue_from Pundit::AuthorizationNotPerformedError, with: :user_not_authorized

  # Devise
  before_action :configure_permitted_parameters, if: :devise_controller?

  # Active model serializer
  # serialization_scope :current_user
  serialization_scope :view_context

  # Set locale for current user
  before_action :set_locale

  # Set flash to header if ajax request
  after_action :flash_to_headers

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

  def w(msg)
    if defined?(Rails.logger.ap)
      Rails.logger.ap msg, :warn
    end
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
      # flash.keep(flash_type)
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

    if exception.respond_to?(:policy) && exception.respond_to?(:query)
      policy_name = exception.policy.class.to_s.underscore
      policy_type = exception.query

      flash.now[:alert] = t("#{policy_name}.#{policy_type}", scope: 'pundit', default: :default)
    else
      flash.now[:alert] = t('pundit.default')
    end

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

  def after_sign_in_path_for(_resource)
    previous_url = previous_url(request.referrer)

    if !session[:previous_url] && request.referrer && request.referrer.include?(root_url) && previous_url
      session[:previous_url] = request.referrer
    end

    session[:previous_url] || root_path(current_user)
  end

  def store_location
    return unless request.get?

    session[:previous_url] = previous_url(request.path) unless request.xhr? # don't store ajax calls
  end

  protected
  def without_tracking(model)
    model.public_activity_off
    yield if block_given?
    model.public_activity_on
  end

  private

  def flash_to_headers
    if request.xhr? && !flash.empty?
      # avoiding XSS injections via flash
      flash_json                           = Hash[flash.map { |k, v| [k, ERB::Util.h(v)] }].to_json
      response.headers['X-Flash-Messages'] = flash_json
      # flash.discard
    end
  end
end
