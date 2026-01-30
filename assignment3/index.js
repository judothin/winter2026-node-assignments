const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://jaydenfagre_db_user:OLive2002@assignment2.r1maoct.mongodb.net/employeeCrud?appName=ASSIGNMENT2';

mongoose.set('strictQuery', true);
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  department: { type: String, required: true },
  startDate: { type: Date, required: true },
  jobTitle: { type: String, required: true, trim: true },
  salary: { type: Number, required: true, min: 0 },
});

const Employee = mongoose.model('Employee', employeeSchema);

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const departments = ['Software', 'IT', 'Sales', 'HR', 'Marketing'];

const buildDepartmentOptions = (selected) =>
  departments.map((dept) => ({ name: dept, selected: dept === selected }));

const toDateInput = (value) => {
  if (!value) return '';
  const d = new Date(value);
  return d.toISOString().split('T')[0];
};

app.get('/', (req, res) => {
  res.render('index', { departments: buildDepartmentOptions() });
});

app.post('/employees', async (req, res) => {
  try {
    const { firstName, lastName, department, startDate, jobTitle, salary } = req.body;
    await Employee.create({
      firstName,
      lastName,
      department,
      startDate,
      jobTitle,
      salary,
    });
    res.redirect('/employees');
  } catch (err) {
    res.status(500).send('Error creating employee.');
  }
});

app.get('/employees', async (req, res) => {
  try {
    const employees = (await Employee.find().lean()).map((emp) => ({
      ...emp,
      startDateDisplay: toDateInput(emp.startDate),
    }));
    res.render('employees', { employees });
  } catch (err) {
    res.status(500).send('Error loading employees.');
  }
});

app.get('/employees/:id/edit', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).lean();
    if (!employee) return res.status(404).send('Employee not found.');
    res.render('edit', {
      employee: { ...employee, startDateInput: toDateInput(employee.startDate) },
      departments: buildDepartmentOptions(employee.department),
    });
  } catch (err) {
    res.status(500).send('Error loading employee.');
  }
});

app.post('/employees/:id/update', async (req, res) => {
  try {
    const { firstName, lastName, department, startDate, jobTitle, salary } = req.body;
    await Employee.findByIdAndUpdate(req.params.id, {
      firstName,
      lastName,
      department,
      startDate,
      jobTitle,
      salary,
    });
    res.redirect('/employees');
  } catch (err) {
    res.status(500).send('Error updating employee.');
  }
});

app.get('/employees/:id/delete', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id).lean();
    if (!employee) return res.status(404).send('Employee not found.');
    res.render('delete', { employee });
  } catch (err) {
    res.status(500).send('Error deleting employee.');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
