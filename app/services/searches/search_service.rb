# frozen_string_literal: true

module Searches
  class SearchService < Searches::BaseSearchService
    def initialize(query, *args)
      super(query, *args)
    end

    def perform
      article_search = tag_search = nil
      search_results = {
        suggestions:  {},
        aggregations: {},
        totalCount:   {},
        totalPages:   {}
      }

      results_format = @params[:complete] ? 'complete' : 'sample'
      visibility     = if @current_user
                         { _or: [{ visibility: 'only_me', user_id: @current_user.id }, { visibility: 'everyone' }] }
                       elsif !@current_admin
                         { visibility: 'everyone' }
                       else
                         { visibility: @params[:visibility] }
                       end

      if search_type('article', @params[:selected_types])
        article_search = Articles::SearchService.new(
          @query,
          defer:        true,
          format:       results_format,
          current_user: current_user,
          page:         @params[:article_page] || @params[:page],
          per_page:     @params[:article_per_page] || @params[:per_page] || Setting.search_per_page,
          highlight:    @current_user ? @current_user.search_highlight : true,
          exact:        @current_user ? @current_user.search_exact : nil,
          operator:     @current_user ? @current_user.search_operator : nil,
          order:        @params[:order],
          where:        {
                          mode:      @params[:mode],
                          draft:     @params[:draft],
                          languages: @params[:language],
                          notation:  @params[:notation],
                          accepted:  @params[:accepted],
                          home_page: @params[:home_page],
                          user_id:   @params[:user_id].presence || @current_user&.id,
                          tag_ids:   @params[:tag_ids].presence,
                          tag_slugs: @params[:tags].presence
                        }.merge(visibility).compact,
          boost_where:  { topic_id: @params[:topic_id] || @current_user&.current_topic_id }
        )
      end

      if search_type('tag', @params[:selected_types])
        tag_search = Tags::SearchService.new(
          @query,
          defer:        true,
          format:       results_format,
          current_user: current_user,
          page:         @params[:tag_page] || @params[:page],
          per_page:     @params[:tag_per_page] || @params[:per_page] || Setting.search_per_page,
          exact:        @current_user ? @current_user.search_exact : nil,
          operator:     @current_user ? @current_user.search_operator : nil,
          order:        @params[:order],
          where:        {
                          user_id:   @params[:user_id],
                          accepted:  @params[:accepted],
                          home_page: @params[:home_page]
                        }.merge(visibility).compact,
          boost_where:  { topic_ids: @params[:topic_id] || @current_user&.current_topic_id }.compact
        )
      end

      # Do not search for topics for now
      # if search_type('topic', @params[:selected_types])
      #   topic_search = Topics::SearchService.new(
      #     @query,
      #     defer:        true,
      #     format:       results_format,
      #     current_user: current_user,
      #     page:         @params[:topic_page] || @params[:page],
      #     per_page:     @params[:topic_per_page] || @params[:per_page] || Setting.search_per_page,
      #     exact:        @current_user ? @current_user.search_exact : nil,
      #     operator:     @current_user ? @current_user.search_operator : nil,
      #     order:        @params[:order],
      #     where:        {
      #                     user_id:   @params[:user_id],
      #                     accepted:  @params[:accepted],
      #                     home_page: @params[:home_page]
      #                   }.merge(visibility).compact
      #   )
      # end

      begin
        searches = Searchkick.multi_search([article_search&.perform&.result, tag_search&.perform&.result].compact)

        searches.map do |search|
          case search.model_name.human
          when 'Article'
            article_results = article_search&.parsed_search(search)

            next if article_results[:articles].empty?
            search_results[:articles]                = article_results[:articles]
            search_results[:suggestions][:articles]  = article_results[:suggestions]
            search_results[:aggregations][:articles] = article_results[:aggregations]
            search_results[:totalCount][:articles]   = article_results[:total_count]
            search_results[:totalPages][:articles]   = article_results[:total_pages]
          when 'Tag'
            tag_results = tag_search&.parsed_search(search)

            next if tag_results[:tags].empty?
            search_results[:tags]               = tag_results[:tags]
            search_results[:suggestions][:tags] = tag_results[:suggestions]
            search_results[:totalCount][:tags]  = tag_results[:total_count]
            search_results[:totalPages][:tags]  = tag_results[:total_pages]
            # when 'Topic'
            #   topic_results = topic_search&.parsed_search(search)
            #
            #   next if topic_results[:topics].empty?
            #   search_results[:topics]               = topic_results[:topics]
            #   search_results[:suggestions][:topics] = topic_results[:suggestions]
            #   search_results[:totalCount][:topics]  = topic_results[:total_count]
            #   search_results[:totalPages][:topics]  = topic_results[:total_pages]
          end
        end

        # Add query params to search results
        if @params[:tags_ids].present?
          search_results[:selectedTags] = Tag.as_flat_json(Tag.where(id: @params[:tags_ids]), strict: true)
        elsif @params[:tags].present?
          search_results[:selectedTags] = Tag.as_flat_json(Tag.where(slug: @params[:tags]), strict: true)
        end

        success(search_results)
      rescue StandardError => error
        error(I18n.t('search.errors.search'), error)
      end
    end
  end
end
