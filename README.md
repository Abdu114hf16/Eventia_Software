# Eventia

A platform that runs the full event lifecycle in one place: planning, official
licensing, vendor and attendee coordination, in-app messaging, and analytics.
Built as a graduation project by a four-person team.

**Case study:** <https://alshammari.dev/projects/eventia/>

## The problem

An event passes through many hands before, during and after it happens.
Organizers plan it, vendors deliver parts of it, attendees take part, and an
authority licenses it. Each group tends to work in its own tool, so status is
hard to track and the compliance steps that make an event legal happen far away
from where the event is actually managed.

## What it does

- **Role-based access** for organizers, vendors, attendees and authorities.
  Each role signs into a view shaped for it while all of them read and write
  the same records.
- **Licensing built in.** The platform walks an organizer through the official
  workflow of the Saudi Conventions and Exhibitions General Authority inside
  the system that already holds the event, rather than sending them to a
  separate portal and back.
- **In-app messaging** so the roles stay in sync.
- **Analytics** turning day-to-day activity into something an organizer can
  read.
- **An AI assistant** built on the Gemini API, answering questions about the
  platform. It is one supporting feature, not the product, and it holds no
  approval authority in the licensing workflow.

## Architecture

Django, with a single application (`core`) holding the models, views, forms,
signals, templates and management commands, and `eventia_project` holding
settings and routing. Data lives in MySQL.

The permission model is the part worth reading. Four role types with genuinely
different rights over the same records means access is enforced at the data
layer rather than by hiding buttons, and that shapes the schema: an event, its
licence application, its vendors and its attendees are related records with
different visibility rather than one document.

```
core/
  models.py        the relational model
  views.py         role-aware request handling
  forms.py         including the licensing workflow forms
  signals.py       lifecycle hooks
  management/      operational commands
  templates/       server-rendered pages
eventia_project/
  settings.py      configuration
  urls.py          routing
```

## Running it locally

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

You will need a MySQL database and, for the assistant, a Gemini API key.
Configure both through `eventia_project/settings.py` or the environment before
running `migrate`.

**A note on `requirements.txt`:** it is a full environment freeze rather than
this project's direct dependencies, so it pins far more than Eventia needs and
will be slow to install. Treat Django, the MySQL driver and the Gemini client
as the real dependencies; the rest is noise from the machine it was captured
on.

## Demo status

The deployment is being moved to a new host. If your browser warns about the
certificate before the platform loads, that move has not landed yet.

## Limitations

- A graduation project. It has not been operated at production scale, and
  nothing here reports uptime, load or incident behaviour.
- The licensing workflow models the official process as it was understood
  during the project. It is not an authorised integration with the authority.
- The AI assistant was not evaluated against a benchmark.
- The security work covers the boundaries the project handles. It is not a
  full application security review.

## Team and contribution

Delivered by a four-person university team. My own contribution focused on
backend and relational-database development and on supporting the integration
of the Gemini-powered AI assistant. I collaborated with the team to connect
these components to the platform's multi-role event-management workflows.

## License

MIT. See [LICENSE](LICENSE).
