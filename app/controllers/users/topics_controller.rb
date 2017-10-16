class Users::TopicsController < ApplicationController
  before_action :authenticate_user!, except: [:index]
  before_action :verify_requested_format!
  after_action :verify_authorized, except: [:index]

  respond_to :json

  def index
    topics = Topic
             .includes(:user)
             .order('topics.name ASC')
             .distinct

    topics = topics.from_user(params[:user_id], current_user&.id)

    topics = Topic.filter_by(topics, filter_params, current_user) unless filter_params.empty?

    respond_to do |format|
      format.json do
        render json:            topics,
               each_serializer: TopicSerializer
      end
    end
  end

  def switch
    user  = User.friendly.find(params[:user_id])
    topic = Topic.friendly.find(params[:new_topic_id])
    authorize topic

    respond_to do |format|
      format.json do
        if user.switch_topic(topic)
          render json:       topic,
                 serializer: TopicTaggedSerializer,
                 status:     :ok
        else
          render json:   { errors: topic.errors },
                 status: :forbidden
        end
      end
    end
  end

  def show
    topic = Topic.friendly.find(params[:id])
    authorize topic

    respond_to do |format|
      format.json do
        render json:       topic,
               serializer: TopicTaggedSerializer
      end
    end
  end

  def create
    user  = User.find(params[:user_id])
    topic = user.topics.build
    authorize topic

    topic.format_attributes(topic_params)

    respond_to do |format|
      format.json do
        if topic.save && user.switch_topic(topic)
          render json:       topic,
                 serializer: TopicSerializer,
                 status:     :created
        else
          render json:   { errors: topic.errors },
                 status: :forbidden
        end
      end
    end
  end

  def update
    # user  = User.find(params[:user_id])
    topic = Topic.find(params[:id])
    authorize topic

    topic.format_attributes(topic_params)

    respond_to do |format|
      format.json do
        if topic.save
          render json:       topic,
                 serializer: TopicSerializer,
                 status:     :ok
        else
          render json:   { errors: topic.errors },
                 status: :forbidden
        end
      end
    end
  end

  def destroy
    # user  = User.find(params[:user_id])
    topic = Topic.find(params[:id])
    authorize topic

    respond_to do |format|
      format.json do
        if topic.destroy
          head :no_content
        else
          render json:   { errors: topic.errors },
                 status: :forbidden
        end
      end
    end
  end

  private

  def topic_params
    params.require(:topic).permit(:name,
                                  :description,
                                  :priority,
                                  :visibility,
                                  :archived,
                                  :accepted,
                                  :picture,
                                  pictures_attributes: [:id,
                                                        :image,
                                                        :_destroy])
  end

  def filter_params
    if params[:filter]
      params.require(:filter).permit(:visibility,
                                     :user_id,
                                     :accepted,
                                     :bookmarked,
                                     user_ids:  []).reject { |_, v| v.blank? }
    else
      {}
    end
  end

end
