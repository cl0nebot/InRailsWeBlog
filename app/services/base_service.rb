# frozen_string_literal: true

class BaseService
  attr_accessor :params, :current_user, :current_admin

  def initialize(params = {})
    @current_user  = params.delete(:current_user)
    @current_admin = params.delete(:current_admin)
    @params        = params.dup
  end

  protected

  def success(result, message = nil)
    ResponseService.new(true, result, message)
  end

  def error(message, errors = nil)
    Raven.capture_exception(errors || message) if Rails.env.production? && (message.is_a?(Exception) || errors&.is_a?(Exception))

    ResponseService.new(false, nil, message.to_s, errors || message.to_s)
  end

end
