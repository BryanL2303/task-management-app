class Task < ApplicationRecord
  belongs_to :account
  belongs_to :calender
  belongs_to :project
end
