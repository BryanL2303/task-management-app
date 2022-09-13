class Account < ApplicationRecord
	has_many :projects
	has_many :tasks
end
