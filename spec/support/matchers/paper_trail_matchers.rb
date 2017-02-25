RSpec::Matchers.define :have_paper_trail do |model|
  match do |actual|
    expect(actual).to have_many(:versions)
    expect(actual).to callback(PaperTrail.clear_transaction_id).after(:commit)

    expect(model).to respond_to(:paper_trail)
  end

  description do
    'model activity'
  end

  failure_message do |model|
    "#{model} expected to have paper trail"
  end

  failure_message_when_negated do |model|
    "#{model} expected not to have paper trail"
  end
end