class AccountSerializer
  include FastJsonapi::ObjectSerializer
  attributes :name, :password

  has_many :projects, :tasks
end
