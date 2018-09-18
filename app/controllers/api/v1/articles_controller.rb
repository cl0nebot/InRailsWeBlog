# frozen_string_literal: true

# == Schema Information
#
# Table name: articles
#
#  id              :integer          not null, primary key
#  author_id       :integer          not null
#  visibility      :integer          default(0), not null
#  notation        :integer          default(0)
#  priority        :integer          default(0)
#  allow_comment   :boolean          default(TRUE), not null
#  private_content :boolean          default(FALSE), not null
#  link         :boolean          default(FALSE), not null
#  draft       :boolean          default(FALSE), not null
#  slug            :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

module Api::V1
  class ArticlesController < ApiController
    before_action :authenticate_user!, except: [:index, :show]
    before_action :verify_requested_format!
    before_action :honeypot_protection, only: [:create, :update]

    after_action :verify_authorized, except: [:index]

    include TrackerConcern
    include CommentConcern

    respond_to :html, :json

    def index
      articles = ::Articles::FindQueries.new.all(filter_params.merge(page: params[:page], limit: params[:limit]), current_user, current_admin)

      respond_to do |format|
        format.json do
          if params[:summary]
            render json:            articles,
                   each_serializer: ArticleSampleSerializer,
                   meta:            meta_attributes(articles)
          else
            render json:            articles,
                   each_serializer: ArticleSerializer,
                   with_outdated:   true,
                   meta:            meta_attributes(articles)
          end
        end
      end
    end

    def show
      article = Article.include_element.friendly.find(params[:id])
      admin_or_authorize article

      respond_to do |format|
        format.json do
          # set_meta_tags title:       titleize(I18n.t('views.article.show.title')),
          #               description: article.meta_description,
          #               author:      alternate_urls(article.user.slug)['fr'],
          #               canonical:   alternate_urls(article.slug)['fr'],
          #               alternate:   alternate_urls('articles', article.slug),
          #               og:          {
          #                 type:  "#{ENV['WEBSITE_NAME']}:article",
          #                 url:   article_url(article),
          #                 image: root_url + article.default_picture
          #               }
          render json:          article,
                 serializer:    ArticleSerializer,
                 with_vote:     true,
                 with_outdated: true
        end
      end
    end

    def history
      article = Article.friendly.find(params[:id])
      admin_or_authorize article

      article_versions = article.versions.where(event: 'update').reverse.drop(1)

      respond_to do |format|
        format.json do
          render json:            article_versions,
                 root:            'history',
                 each_serializer: HistorySerializer
        end
      end
    end

    def create
      article = current_user.articles.build
      admin_or_authorize article

      stored_article = ::Articles::StoreService.new(article, article_params.merge(current_user: current_user)).perform

      respond_to do |format|
        format.json do
          if stored_article.success?
            flash.now[:success] = stored_article.message
            render json:       stored_article.result,
                   serializer: ArticleSerializer,
                   status:     :created
          else
            flash.now[:error] = stored_article.message
            render json:   { errors: stored_article.errors },
                   status: :unprocessable_entity
          end
        end
      end
    end

    def edit
      article = Article.include_element.friendly.find(params[:id])
      admin_or_authorize article

      respond_to do |format|
        format.html do
          set_meta_tags title:       titleize(I18n.t('views.article.edit.title', title: article.title)),
                        description: I18n.t('views.article.edit.description', title: article.title),
                        canonical:   article_canonical_url("#{article.id}/edit")
          render :edit, locals: {
            article:         article,
            current_user_id: current_user&.id
          }
        end
      end
    end

    def update
      article = Article.find(params[:id])
      admin_or_authorize article

      stored_article = ::Articles::StoreService.new(article, article_params.merge(current_user: current_user)).perform

      respond_to do |format|
        format.json do
          if stored_article.success?
            flash.now[:success] = stored_article.message unless params[:auto_save]
            render json:          article,
                   serializer:    ArticleSerializer,
                   with_vote:     true,
                   with_outdated: true,
                   status:        :ok
          else
            flash.now[:error] = stored_article.message
            render json:   { errors: stored_article.errors },
                   status: :unprocessable_entity
          end
        end
      end
    end

    def update_priority
      articles = []
      priority_params[:article_ids].reverse.each_with_index do |id, i|
        article = Article.find(id)
        admin_or_authorize article, :update?
        articles << article if article.update_columns(priority: i + 1)
      end

      respond_to do |format|
        format.json do
          if articles.present?
            flash.now[:success] = t('views.article.flash.successful_priority_update')
            render json:            articles.reverse,
                   each_serializer: ArticleSerializer,
                   status:          :ok
          else
            flash.now[:error] = t('views.article.flash.error_priority_update')
            render json:   { errors: t('views.article.flash.error_priority_update') },
                   status: :unprocessable_entity
          end
        end
      end
    end

    def restore
      article = Article.with_deleted.find(params[:id])
      admin_or_authorize article

      version = PaperTrail::Version.find_by(id: params[:version_id])

      if version && (restored_version = version.reify)
        params[:article_version_id] ? article.save : restored_version.save

        article.reload

        respond_to do |format|
          flash.now[:success] = t('views.article.flash.successful_undeletion') if params[:from_deletion]
          # format.html do
          #   redirect_to article_path(article)
          # end
          format.json do
            render json:   article,
                   status: :accepted
          end
        end
      else
        respond_to do |format|
          flash.now[:error] = t('views.article.flash.not_found')
          # format.html do
          #   # set_meta_tags title:       titleize(I18n.t('views.article.edit.title')),
          #   #               description: I18n.t('views.article.edit.description'),
          #   #               canonical:   article_canonical_url("#{article.id}/edit")
          #   render json:         {},
          #          formats:      :json,
          #          content_type: 'application/json'
          # end
          format.json do
            render json:   {},
                   status: :not_found
          end
        end
      end
    end

    def destroy
      article = Article.find(params[:id])
      admin_or_authorize article

      respond_to do |format|
        format.json do
          if params[:permanently] && current_admin ? article.really_destroy! : article.destroy
            flash.now[:success] = I18n.t('views.article.flash.successful_deletion')
            head :no_content
          else
            flash.now[:error] = I18n.t('views.article.flash.error_deletion', errors: article.errors.to_s)
            render json:   { errors: article.errors },
                   status: :unprocessable_entity
          end
        end
      end
    end

    private

    def article_params
      params.require(:article).permit(:mode,
                                      :title,
                                      :summary,
                                      :content,
                                      :reference,
                                      :visibility,
                                      :notation,
                                      :priority,
                                      :allow_comment,
                                      :draft,
                                      :topic_id,
                                      :language,
                                      :picture_ids,
                                      tags:        [
                                                     :name,
                                                     :visibility,
                                                     :new
                                                   ],
                                      parent_tags: [
                                                     :name,
                                                     :visibility,
                                                     :new
                                                   ],
                                      child_tags:  [
                                                     :name,
                                                     :visibility,
                                                     :new
                                                   ])
    end

    def filter_params
      if params[:filter]
        params.require(:filter).permit(:visibility,
                                       :mode,
                                       :draft,
                                       :accepted,
                                       :user_id,
                                       :user_slug,
                                       :topic_id,
                                       :topic_slug,
                                       :tag_id,
                                       :tag_slug,
                                       :parent_tag_slug,
                                       :child_tag_slug,
                                       :bookmarked,
                                       :order,
                                       user_ids:  [],
                                       topic_ids: []).reject { |_, v| v.blank? }
      else
        {}
      end
    end

    def priority_params
      if params[:article_ids]
        params.permit(article_ids: [])
      else
        {}
      end
    end

  end
end
