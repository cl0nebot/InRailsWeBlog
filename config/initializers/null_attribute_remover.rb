# frozen_string_literal: true

module NullAttributesRemover
  def attributes(*args)
    super.compact
  end
end
