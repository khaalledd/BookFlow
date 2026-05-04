import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

async function stressTestDoubleBooking() {
  console.log('--- Double Booking Stress Test ---');
  // NOTE: Set these variables directly from your generated data, or execute logic to create them here.
  const customerToken = '2827fd22-815e-4619-b3ff-baf6f4d91e16';
  const businessId = '53817e67-80c8-42cf-ac19-c11c5e6293d6';
  const serviceId = 'fb28664c-2748-43e4-8185-c9ff8a75ea77';
  
  if(customerToken === 'INSERT_CUSTOMER_TOKEN_HERE') {
    console.log('Please insert valid customerToken, businessId, and serviceId before running.');
    return;
  }

  const payload = {
    businessId,
    serviceId,
    date: '2026-11-06', // make sure this is a valid future date
    startTime: '12:00',
    notes: 'Concurrent booking attempt',
  };

  const requests = [];
  const CONCURRENCY = 5;

  console.log(`Sending ${CONCURRENCY} simultaneous booking requests for the exact same slot...`);

  for (let i = 0; i < CONCURRENCY; i++) {
    requests.push(
      axios.post(`${BASE_URL}/bookings`, payload, {
        headers: { Authorization: `Bearer ${customerToken}` },
      })
      .then(res => ({ idx: i, status: res.status, data: res.data }))
      .catch(err => ({ idx: i, status: err.response?.status, error: err.response?.data?.message }))
    );
  }

  const results = await Promise.all(requests);
  
  let successCount = 0;
  let failCount = 0;

  results.forEach(res => {
    if (res.status === 201) {
      console.log(`Request ${res.idx}: 🟢 SUCCESS (Booking Created)`);
      successCount++;
    } else {
      console.log(`Request ${res.idx}: 🔴 FAILED (${res.status} - ${res.error})`);
      failCount++;
    }
  });

  console.log(`\nResults: ${successCount} Successes, ${failCount} Failures.`);
  
  if (successCount === 1 && failCount === CONCURRENCY - 1) {
    console.log('✅ TEST PASSED: Only ONE booking succeeded. Double-booking prevented perfectly!');
  } else if (successCount > 1) {
    console.log('❌ TEST FAILED: Multiple bookings succeeded!');
  } else {
    console.log('⚠️ TEST INCONCLUSIVE: Look at the errors above. Maybe slot was already booked or data is invalid.');
  }
}

stressTestDoubleBooking();
