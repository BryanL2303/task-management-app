class UpdateCalenderModel < ActiveRecord::Migration[7.0]
  def change
    change_table :calenders do |t|
      t.integer :year
      t.integer :mon
      t.integer :mday
      t.integer :wday
      t.string :string
    end
  end
end
