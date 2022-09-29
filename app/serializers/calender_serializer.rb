class CalenderSerializer
  include FastJsonapi::ObjectSerializer
  attributes :date, :year, :mon, :mday, :wday

  has_many :tasks
end
