class TagsController < ApplicationController
  # before_filter :authenticate_user!, except: [:index]
  # after_action :verify_authorized, except: [:index, :check_id]

  respond_to :html, :js, :json

  def index
    tags = Tag.all.order('name ASC')

    respond_to do |format|
      format.html { render :tags, formats: :json, locals: {tags: tags} }

      format.json { render :tags, locals: {tags: tags} }
    end
  end

  def show
    tag = Tag.friendly.find(params[:id])

    current_user_id = current_user ? current_user.id : nil

    articles = Article.user_related(current_user_id).joins(:tags).where(tags: {name: tag.name}).order('articles.id DESC')

    respond_to do |format|
      format.html { render :show, locals: {tag: tag, articles: articles, current_user_id: current_user_id} }
    end
  end

  def create
  end

  def edit
  end

  def update
  end

  def destroy
  end

  private

  def tag_params
    params.require(:tags).permit(:name)
  end
end
