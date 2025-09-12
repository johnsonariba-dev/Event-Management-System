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

# eventdetails sharing
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
cp .env.example .env  # macOS/Linux
# Windows
copy .env.example .env #then you fill in the credentials

# run recommender
python convert_db.py
python recommender.py

# qrcode
pip install qrcode fpdf

# Database Setup (Alembic + Supabase)
pip install alembic
alembic init migrations
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head


# for paypal payment
npm install @paypal/react-paypal-js   (for the frontend)
pip install python-dotenv  (for backend)
python -m endpoints.faker_events [pour run]
python convert_db.py
python recommender.py
python -m endpoints.faker_events [pour run]
python3 convert_db.py
python3 recommender.py
