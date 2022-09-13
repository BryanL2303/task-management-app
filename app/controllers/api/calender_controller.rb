module Api
	class CalenderController < ApplicationController
		protect_from_forgery with: :null_session
		
		def index
			dates = Calender.all
			render json: CalenderSerializer.new(dates, options).serialized_json
		end

		def create
			date = Calender.new(calender_params)

			if date.save
				render json: CalenderSerializer.new(date).serialized_json
			else
				render json: {error: calender.errors.messages}, status: 422
			end
		end

		def destroy
			date = Calender.find_by(date: params[:date])
			tasks = Task.where(calender_id: date.id)
			for task in tasks
				task.scheduled = false
				task.time = nil
				task.calender_id = nil
				task.save
			end

			if date.destroy
				head :no_content
			else
				render json: {error: calender.errors.messages}, status: 422
			end
		end

		def show
			date = Calender.find_by(date: params[:date])

			render json: CalenderSerializer.new(date, options).serialized_json
		end

		def set_week_dates
			dates = Calender.where(date: [params[:date0]...params[:date7]]).order("date")
			past_dates = Calender.where(date: ["2000-01-01"...params[:date0]])
			if past_dates.length != 0
				for date in past_dates
					tasks = Task.where(calender_id: date.id)
					for task in tasks
						task.scheduled = false
						task.time = nil
						task.calender_id = nil
						task.save
					end
					date.destroy
				end
			end
			if dates.length != 7
				date = Calender.find_by(date: params[:date0])
				if date == nil 
					date = Calender.new(date: params[:date0])
					date.save
				end
				date = Calender.find_by(date: params[:date1])
				if date == nil 
					date = Calender.new(date: params[:date1])
					date.save
				end
				date = Calender.find_by(date: params[:date2])
				if date == nil 
					date = Calender.new(date: params[:date2])
					date.save
				end
				date = Calender.find_by(date: params[:date3])
				if date == nil 
					date = Calender.new(date: params[:date3])
					date.save
				end
				date = Calender.find_by(date: params[:date4])
				if date == nil 
					date = Calender.new(date: params[:date4])
					date.save
				end
				date = Calender.find_by(date: params[:date5])
				if date == nil 
					date = Calender.new(date: params[:date5])
					date.save
				end
				date = Calender.find_by(date: params[:date6])
				if date == nil 
					date = Calender.new(date: params[:date6])
					date.save
				end
				dates = Calender.where(date: [params[:date0]...params[:date7]]).order("date")
			end

			render json: CalenderSerializer.new(dates, options).serialized_json
		end

		private
		def options
			@options ||= { include: %i{tasks}}
		end
	end
end
