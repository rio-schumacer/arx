import { fetchAaveRates } from '../../lib/aave';

export async function GET() {
const rates = await fetchAaveRates();
return Response.json(rates);
}
