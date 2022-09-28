Rails.application.routes.draw do
  root "pages#index"

  namespace :api do
    resources :account do 
      member do
        get '/projects' => 'account#getProjects'
        get '/get_unscheduled_tasks' => 'account#getUnscheduledTasks'
        get '/get_tasks_by_date/:calender_id' => 'account#getTasksByDate'
        get '/get_tasks_by_project/:project_id' => 'account#getTasksByProject'
        post '/create_account' => 'account#createAccount'
        post '/authenticate_account' => 'account#authenticateAccount'
        post '/get_tasks_on_calender' => 'account#getTasksOnCalender'
      end
    end

    resources :calender, param: :date do
      member do
        get '/set_week_dates' => 'calender#setWeekDates'
        get '/append_next_year' => 'calender#appendNextYear'
        post '/get_month_dates' => 'calender#getMonthDates'
      end
    end

    resources :project do
      member do
        post '/create_project' => 'project#createProject'
        post '/update_project' => 'project#updateProject'
      end
    end

    resources :task do 
      member do
        post '/create_task' => 'task#createTask'
        post '/update_task' => 'task#updateTask'
        post '/reschedule_task' => 'task#rescheduleTask'
      end
    end
  end

  get '*path', to: 'pages#index', via: :all
end
