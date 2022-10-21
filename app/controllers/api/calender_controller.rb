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

		def setWeekDates
			today = Date.today
			nextweek = today + 7
			dates = Calender.where(date: [today.strftime("%Y-%m-%d")...nextweek.strftime("%Y-%m-%d")]).order("date")
			past_dates = Calender.where(date: ["2000-01-01"...today.strftime("%Y-%m-%d")])
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
				count = 0
				date = today
				while count < 7
					tempDate = Calender.find_by(date: date.strftime("%Y-%m-%d"))
					if tempDate == nil 
						tempDate = Calender.new(date: date, year: date.year, mon: date.mon, mday: date.mday, wday: date.wday, string: date.strftime("%A"))
						tempDate.save
					end
					count += 1
					date += 1
				end
				dates = Calender.where(date: [today.strftime("%Y-%m-%d")...nextweek.strftime("%Y-%m-%d")]).order("date")
			end

			render json: CalenderSerializer.new(dates, options).serialized_json
		end

		def appendNextYear
			date = Date.today
			target = Date.new(date.year+1, date.mon, date.mday)
			while date < target
				tempDate = Calender.find_by(date: date)
				if tempDate == nil
					tempDate = Calender.new(date: date, year: date.year, mon: date.mon, mday: date.mday, wday: date.wday, string: date.strftime("%A"))
					tempDate.save
				end
				date += 1
			end
			render json: {data: true}
		end

		def getMonthDates
			dates = Calender.where(year: params[:year], mon: params[:mon]).order("date")
			marray = Array.new(5)
			marraycount = 0
			mcount = 0
			warray = Array.new(7)
			if dates[0] != nil
				wcount = dates[0].wday
				if ((7 - wcount) + 28) < dates.length
					temp = 28 + (7-wcount)
					tempCount = 0
					while temp < dates.length
						warray[tempCount] = dates[temp]
						temp += 1
						tempCount += 1
					end
					while wcount < 7
						warray[wcount] = dates[mcount]
						mcount += 1
						wcount += 1
					end
					marray[marraycount] = warray
					marraycount += 1
					wcount = 0
					warray = Array.new(7)
				end
				while mcount < dates.length
					while wcount < 7
						warray[wcount] = dates[mcount]
						mcount += 1
						wcount += 1
					end
					if wcount == 7 && marraycount != 5
						marray[marraycount] = warray
						marraycount += 1
						wcount = 0
						warray = Array.new(7)
					end
				end
				while wcount < 7
					warray[wcount] = nil
					wcount += 1
				end
				marraycount += 1
				while marraycount < 5
					marray[marraycount] = [nil, nil, nil, nil, nil, nil, nil]
					marraycount += 1
				end
			else
				wcount = 0
				while mcount < 35
					while wcount < 7
						warray[wcount] = nil
						mcount += 1
						wcount += 1
					end
					if wcount == 7
						marray[marraycount] = warray
						marraycount += 1
						wcount = 0
						warray = Array.new(7)
					end
				end
			end
			render json: {data: marray}
		end

		private
		def options
			@options ||= { include: %i{tasks}}
		end
	end
end
