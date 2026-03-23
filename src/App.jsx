import { useMemo, useState } from 'react';

const catalog = [
  {
    id: 'p1',
    type: 'pandit',
    name: 'Pandit Rajesh Sharma',
    city: 'Delhi',
    language: ['Hindi', 'Sanskrit'],
    rating: 4.9,
    price: 15000,
    availability: ['2026-04-12', '2026-04-15', '2026-04-22'],
    specialties: ['Vedic Vivah', 'Destination Wedding Pooja'],
  },
  {
    id: 'p2',
    type: 'pandit',
    name: 'Pandita Meera Joshi',
    city: 'Jaipur',
    language: ['Hindi', 'Marwari'],
    rating: 4.7,
    price: 12000,
    availability: ['2026-04-10', '2026-04-15', '2026-04-28'],
    specialties: ['Inter-faith Guidance', 'Sangeet Ritual Planning'],
  },
  {
    id: 's1',
    type: 'samagri',
    name: 'Shadi Samagri Premium Kit',
    city: 'All India Shipping',
    rating: 4.8,
    price: 8500,
    stock: 32,
    contains: ['Havan Samagri', 'Kalash Set', 'Moli, Roli, Chawal', 'Pooja Vastra'],
  },
  {
    id: 's2',
    type: 'samagri',
    name: 'Eco-friendly Decoration + Ritual Pack',
    city: 'NCR, Jaipur, Lucknow',
    rating: 4.6,
    price: 6200,
    stock: 14,
    contains: ['Natural Flowers', 'Cow Ghee Diyas', 'Banana Leaves Setup'],
  },
  {
    id: 'v1',
    type: 'venue',
    name: 'Anand Vatika Lawn',
    city: 'Noida',
    rating: 4.5,
    price: 180000,
    availability: ['2026-04-12', '2026-04-19', '2026-04-25'],
    capacity: 600,
  },
  {
    id: 'v2',
    type: 'venue',
    name: 'Royal Courtyard Banquet',
    city: 'Jaipur',
    rating: 4.8,
    price: 250000,
    availability: ['2026-04-10', '2026-04-22', '2026-04-29'],
    capacity: 450,
  },
];

const aiAgents = [
  {
    id: 'a1',
    name: 'Budget Agent',
    role: 'Suggests best value combinations under your total budget.',
  },
  {
    id: 'a2',
    name: 'Availability Agent',
    role: 'Auto-matches common free dates across pandit, venue, and samagri vendors.',
  },
  {
    id: 'a3',
    name: 'Ritual Assistant Agent',
    role: 'Creates checklist for each ceremony (haldi, mehendi, wedding day, grih pravesh).',
  },
];

function App() {
  const [mode, setMode] = useState('customer');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('2026-04-15');
  const [budget, setBudget] = useState(200000);
  const [bookings, setBookings] = useState([]);

  const cities = useMemo(
    () => ['all', ...new Set(catalog.filter(item => item.type !== 'samagri').map(item => item.city))],
    [],
  );

  const filteredServices = useMemo(() => {
    return catalog.filter(item => {
      const matchesType = serviceFilter === 'all' || item.type === serviceFilter;
      const matchesCity =
        cityFilter === 'all' || item.city === cityFilter || item.city.includes('All India');

      const hasDate = item.availability ? item.availability.includes(dateFilter) : true;
      return matchesType && matchesCity && hasDate;
    });
  }, [serviceFilter, cityFilter, dateFilter]);

  const recommendedPlan = useMemo(() => {
    const pandit = catalog
      .filter(item => item.type === 'pandit' && item.availability?.includes(dateFilter))
      .sort((a, b) => b.rating - a.rating)[0];

    const venue = catalog
      .filter(item => item.type === 'venue' && item.availability?.includes(dateFilter))
      .sort((a, b) => a.price - b.price)[0];

    const samagri = catalog
      .filter(item => item.type === 'samagri' && item.stock > 0)
      .sort((a, b) => a.price - b.price)[0];

    const items = [pandit, venue, samagri].filter(Boolean);
    const total = items.reduce((sum, item) => sum + item.price, 0);

    return {
      items,
      total,
      inBudget: total <= budget,
    };
  }, [budget, dateFilter]);

  const handleBook = item => {
    setBookings(prev => [
      {
        id: `${item.id}-${Date.now()}`,
        name: item.name,
        type: item.type,
        date: dateFilter,
        price: item.price,
      },
      ...prev,
    ]);
  };

  return (
    <main className="app-shell">
      <header className="hero">
        <h1>💍 ShadiSathi</h1>
        <p>
          Pandit, samagri, venue, aur wedding services ki smart booking platform — AI agents ke
          saath.
        </p>
        <div className="mode-switch">
          <button
            className={mode === 'customer' ? 'active' : ''}
            onClick={() => setMode('customer')}
            type="button"
          >
            Customer View
          </button>
          <button
            className={mode === 'pandit' ? 'active' : ''}
            onClick={() => setMode('pandit')}
            type="button"
          >
            Pandit / Vendor View
          </button>
        </div>
      </header>

      {mode === 'customer' ? (
        <section className="layout-grid">
          <article className="card controls">
            <h2>Booking Filters</h2>
            <label>
              Service
              <select value={serviceFilter} onChange={e => setServiceFilter(e.target.value)}>
                <option value="all">All Services</option>
                <option value="pandit">Pandit</option>
                <option value="samagri">Samagri</option>
                <option value="venue">Venue</option>
              </select>
            </label>

            <label>
              City
              <select value={cityFilter} onChange={e => setCityFilter(e.target.value)}>
                {cities.map(city => (
                  <option key={city} value={city}>
                    {city === 'all' ? 'All Cities' : city}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Wedding Date
              <input value={dateFilter} onChange={e => setDateFilter(e.target.value)} type="date" />
            </label>

            <label>
              Total Budget (₹)
              <input
                value={budget}
                min={50000}
                max={1000000}
                onChange={e => setBudget(Number(e.target.value))}
                type="number"
              />
            </label>
          </article>

          <article className="card list">
            <h2>Available Bookings</h2>
            {filteredServices.length === 0 ? (
              <p className="muted">Iss date/city combination par koi service available nahi hai.</p>
            ) : (
              filteredServices.map(item => (
                <div className="service-item" key={item.id}>
                  <div>
                    <h3>{item.name}</h3>
                    <p>
                      {item.city} • ⭐ {item.rating}
                    </p>
                    <p>₹ {item.price.toLocaleString('en-IN')}</p>
                    {'stock' in item ? <p>Stock left: {item.stock}</p> : null}
                  </div>
                  <button type="button" onClick={() => handleBook(item)}>
                    Book Now
                  </button>
                </div>
              ))
            )}
          </article>

          <article className="card ai">
            <h2>AI Agents (Recommended)</h2>
            {aiAgents.map(agent => (
              <div key={agent.id} className="agent-item">
                <strong>{agent.name}</strong>
                <p>{agent.role}</p>
              </div>
            ))}

            <div className="recommendation">
              <h3>Auto Plan Suggestion</h3>
              {recommendedPlan.items.map(item => (
                <p key={item.id}>
                  • {item.name} (₹ {item.price.toLocaleString('en-IN')})
                </p>
              ))}
              <p>
                Total: <strong>₹ {recommendedPlan.total.toLocaleString('en-IN')}</strong>
              </p>
              <p className={recommendedPlan.inBudget ? 'ok' : 'warn'}>
                {recommendedPlan.inBudget
                  ? '✅ Plan is within your budget'
                  : '⚠️ Budget se bahar hai, lower price options try karein.'}
              </p>
            </div>
          </article>

          <article className="card bookings">
            <h2>My Bookings</h2>
            {bookings.length === 0 ? (
              <p className="muted">Abhi tak koi booking nahi hai.</p>
            ) : (
              bookings.map(booking => (
                <p key={booking.id}>
                  {booking.name} ({booking.type}) — {booking.date} — ₹{' '}
                  {booking.price.toLocaleString('en-IN')}
                </p>
              ))
            )}
          </article>
        </section>
      ) : (
        <section className="layout-grid single">
          <article className="card">
            <h2>Pandit / Vendor Dashboard</h2>
            <p>
              Yahan se pandit aur vendors apna profile, service slots, pricing, aur live availability
              manage kar sakte hain.
            </p>
            <ul>
              <li>Daily slot calendar update</li>
              <li>Bulk samagri stock update</li>
              <li>AI demand forecast for next 30 days</li>
              <li>Auto lead scoring (high intent customers first)</li>
            </ul>
          </article>
        </section>
      )}
    </main>
  );
}

export default App;
