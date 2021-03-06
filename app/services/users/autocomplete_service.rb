# frozen_string_literal: true

module Users
  class AutocompleteService < Searches::BaseSearchService
    def initialize(query, *args)
      super(query, *args)

      @params[:model]  = User
      @params[:format] = @params[:format] || 'strict'
    end

    def perform
      # If query not defined or blank, do not search
      query_string = @query.blank? ? nil : @query

      # Fields with boost
      fields = %w[pseudo]

      # Where options only for ElasticSearch
      where_options = where_search(@params[:where])

      # Order search
      order = order_search(@params[:order])

      # Set result limit
      limit = @params[:limit] || Setting.per_page

      begin
        results = User.search(query_string,
                              fields:       fields,
                              match:        :word_middle,
                              misspellings: false,
                              load:         false,
                              where:        where_options,
                              order:        order,
                              limit:        limit,
                              execute:      !@params[:defer])

        if @params[:defer]
          success(results)
        else
          success(format_search(results))
        end
      rescue StandardError => error
        error(I18n.t('search.errors.user'), error)
      end
    end
  end
end
