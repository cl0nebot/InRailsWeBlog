module Api::V1
  class Users::BookmarksController < ApplicationController
    before_action :authenticate_user!
    before_action :verify_requested_format!
    after_action :verify_authorized

    respond_to :json

    def create
      user     = User.find(params[:user_id])
      bookmark = user.bookmarks.build
      authorize bookmark

      respond_to do |format|
        format.json do
          if bookmark.add(user, bookmark_params[:model_type], bookmark_params[:model_id])
            render json:       bookmark,
                   serializer: BookmarkSerializer,
                   status:     :created
          else
            render json:   { errors: bookmark.errors },
                   status: :forbidden
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
          if bookmark.remove(user, bookmark_params[:model_type], bookmark_params[:model_id])
            head :no_content
          else
            render json:   { errors: bookmark.errors },
                   status: :forbidden
          end
        end
      end
    end

    private

    def bookmark_params
      params.require(:bookmark).permit(:model_type,
                                       :model_id)
    end
  end
end