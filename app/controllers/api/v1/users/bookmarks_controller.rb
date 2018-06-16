module Api::V1
  class Users::BookmarksController < ApplicationController
    before_action :authenticate_user!
    before_action :verify_requested_format!
    after_action :verify_authorized

    respond_to :json

    def index
      bookmarks = Rails.cache.fetch("user_bookmarks:#{params[:user_id]}-#{params[:topic_id]}", expires_in: CONFIG.cache_time) do
        user = User.find(params[:user_id])
        admin_or_authorize user, :bookmarks?

        bookmarks = user.bookmarks.includes(:bookmarked)

        bookmarks = bookmarks.where(topic_id: params[:topic_id]) if params[:topic_id].present?
      end

      respond_to do |format|
        format.json do
          render json:            bookmarks,
                 each_serializer: BookmarkSerializer
        end
      end
    end

    def create
      user     = User.find(params[:user_id])
      bookmark = user.bookmarks.build
      authorize bookmark

      respond_to do |format|
        format.json do
          if bookmark.add(user, bookmark_params[:bookmarked_model], bookmark_params[:bookmarked_id], bookmark_params[:topic_id])
            render json:       bookmark,
                   serializer: BookmarkSerializer,
                   status:     :created
          else
            render json:   { errors: bookmark.errors },
                   status: :unprocessable_entity
          end
        end
      end
    end

    def destroy
      user     = User.find(params[:user_id])
      bookmark = Bookmark.find(params[:id])
      authorize bookmark

      respond_to do |format|
        format.json do
          if bookmark.remove(user, bookmark_params[:bookmarked_model], bookmark_params[:bookmarked_id])
            head :no_content
          else
            render json:   { errors: bookmark.errors },
                   status: :unprocessable_entity
          end
        end
      end
    end

    private

    def bookmark_params
      params.require(:bookmark).permit(:bookmarked_model,
                                       :bookmarked_id,
                                       :topic_id)
    end
  end
end
