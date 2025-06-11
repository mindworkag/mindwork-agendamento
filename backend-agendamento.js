
const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const SERVICE_ACCOUNT = require('./agenda-mind-work2-2ecd0abc9cdb.json');
const calendarId = 'contato.mindworkagency@gmail.com';

const auth = new google.auth.JWT(
  SERVICE_ACCOUNT.client_email,
  null,
  SERVICE_ACCOUNT.private_key,
  ['https://www.googleapis.com/auth/calendar']
);

const calendar = google.calendar({ version: 'v3', auth });

app.post('/agendar', async (req, res) => {
  try {
    const { name, email, dateTime } = req.body;
    const start = new Date(dateTime);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

    const event = {
      summary: `Reunião com ${name}`,
      description: `Agendamento pelo site Mindwork`,
      start: { dateTime: start.toISOString() },
      end: { dateTime: end.toISOString() },
      attendees: [{ email }],
    };

    await calendar.events.insert({ calendarId, resource: event });
    res.status(200).json({ message: 'Agendado com sucesso!' });
  } catch (error) {
    console.error('Erro ao agendar:', error);
    res.status(500).json({ message: 'Erro ao agendar reunião.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
