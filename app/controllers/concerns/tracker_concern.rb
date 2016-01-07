# ActAsTrackedConcern
# Include this method in the controller:
# include TrackerConcern
module TrackerConcern
  extend ActiveSupport::Concern

  included do
    # For devise, skip user authentification
    skip_before_action :authenticate_user!, only: [:clicked, :viewed]
    # For locale, skip locale set up
    skip_before_action :set_locale, only: [:clicked, :viewed]
    # For pundit, skip authorization
    skip_after_action :verify_authorized, only: [:clicked, :viewed]
  end

  # Tracker action method to get clicks from clients
  def clicked
    class_model = params[:controller].classify.constantize
    class_model.track_clicks(params[:id])
    render json: { success: true }
  end

  # Tracker action method to get views from clients
  def viewed
    class_model = params[:controller].classify.constantize
    class_model.track_views(params[:id].split(','))
    render json: { success: true }
  end

  private

  def tracker_params
    params.require(:tracker).permit(:id,
                                    :model)
  end
end
