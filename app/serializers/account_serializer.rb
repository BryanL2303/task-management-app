class AccountSerializer
  include FastJsonapi::ObjectSerializer
  attributes :name, :password

  has_many :projects
  has_many :tasks
end
