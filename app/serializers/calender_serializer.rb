class CalenderSerializer
  include FastJsonapi::ObjectSerializer
  attributes :date

  has_many[:tasks]
end
