# Model and research contract
Each experiment is evaluated independently with the full declared starting cash. No portfolio or business is automatically selected.

## Monthly event order and equations
Demand = floor(leadsMonthly × conversion × scenarioMultiplier).
Delivery capacity = floor((availableHours−acquisitionHours)/deliveryHours), or demand if deliveryHours is zero.
Delivered units = min(demand, capacity). Units are constant each month; downside/base/upside multipliers are declared assumptions, not probability distributions.
Gross revenue = units × price.
Net earned revenue = gross × (1−feeRate).
Monthly cash expense = fixedMonthly + marketingMonthly + units × variableCost.
Owner hours = acquisitionHours + units × deliveryHours.
At time zero pay startupCost. Each month pay expenses first, then collect net earned revenue from paymentDelay months earlier. In month 1 with zero delay, receipts occur after expenses. No opening receivables exist.

Net cash flow excludes starting cash. Cash balance adds starting cash. Peak funding is the maximum cumulative shortfall including expenses before receipts; additional funding subtracts available starting cash and floors at zero.
Receivables = net earned revenue over horizon minus collected cash. They have no assumed liquidation or bad-debt adjustment.
Operating break-even units = ceil((fixedMonthly+marketingMonthly)/(price×(1−feeRate)−variableCost)) if unit contribution is positive; otherwise null. It excludes startup cost and owner time and can exceed delivery capacity.
Payback month is the earliest month with cumulative cash flow nonnegative for every subsequent modeled month. This is horizon-bounded, not proof of lasting break-even.
Time-adjusted surplus = net earned revenue − startup and modeled expenses − ownerHours×declared hourlyTimeValue. This is a noncash sensitivity metric, not statutory profit or wages.

## Boundaries
Prices and costs use one declared currency. No currency conversion, taxes, financing, interest, refunds, default, inventory, recurring customer retention, seasonality, working-capital recovery, startup labor, overhead not entered, or demand forecasting is implemented. The app does not spend, sell, contact customers, collect payments, or guarantee income.
Starting cash is a comparison assumption. A negative balance signals a modeled funding gap, not permission or advice to borrow.

## Evidence and research workflow
Use fictional or rights-cleared business assumptions, document sources and dates, and record reviewer rationale. Source/review fields are unverified declarations. Validate demand and delivery time with small authorized experiments before extrapolating. Review price, conversion, cost and collection-delay sensitivity. Results are ordinary research records, not authenticated accounting statements.
Local storage is browser/origin-specific; export backups. JSON is the canonical input, CSV and Markdown summarize outcomes.
Independent ResearchOS TECT research; no government affiliation or validated commercial performance claimed.
