class AddUserIdForeignKey < ActiveRecord::Migration[7.0]
  def change
    change_table :tasks do |t|
      t.belongs_to :account 
    end
    change_table :projects do |t|
      t.belongs_to :account
    end
  end
end
