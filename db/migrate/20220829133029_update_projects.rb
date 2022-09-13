class UpdateProjects < ActiveRecord::Migration[7.0]
  def change
    change_table :projects do |t|
      t.remove :project_id
    end
  end
end
