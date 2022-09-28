# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2022_09_28_113417) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "accounts", force: :cascade do |t|
    t.string "name"
    t.string "password"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "calenders", force: :cascade do |t|
    t.date "date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "year"
    t.integer "mon"
    t.integer "mday"
    t.integer "wday"
    t.string "string"
  end

  create_table "projects", force: :cascade do |t|
    t.string "project_name"
    t.string "project_description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "account_id"
    t.string "tag"
    t.index ["account_id"], name: "index_projects_on_account_id"
  end

  create_table "tasks", force: :cascade do |t|
    t.string "task_name"
    t.string "task_description"
    t.time "time"
    t.boolean "scheduled"
    t.bigint "calender_id"
    t.bigint "project_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "completed"
    t.integer "task_priority"
    t.bigint "account_id"
    t.string "tag"
    t.boolean "on_calender"
    t.index ["account_id"], name: "index_tasks_on_account_id"
    t.index ["calender_id"], name: "index_tasks_on_calender_id"
    t.index ["project_id"], name: "index_tasks_on_project_id"
  end

  add_foreign_key "tasks", "calenders"
  add_foreign_key "tasks", "projects"
end
