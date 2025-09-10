# Event-Management-System
Appstech event management system [PlanVibes]

# install
npm install

# tailwind
npm install tailwindcss @tailwindcss/vite

# react router
npm install react-router-dom

# react icons
npm install react icons

# animation
npm install framer-motion

# calendar
npm install react-calendar date-fns
npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction

#eventdetails sharing
npm install --save-dev @types/react @types/react-dom


# Virtual environment
python3 -m venv venv 
source venv/bin/activate

# Requirements for backend
pip install -r requirements.txt
pip install fastapi
pip install uvicorn
pip install pydantic
pip install sqlalchemy
pip install "python-jose[cryptography]"

pip install "pydantic[email]"
pip install "passlib[bcrypt]"
pip install faker

# run database
python -m endpoints.faker_events 

# run recommender
python convert_db.py
python recommender.py