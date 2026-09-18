# Data API plan

Recommended Supabase tables:
events
ads_plans
finance
tasks
tenants
influencers
agenda
audit_logs

Recommended Storage:
finance-proofs (private)

Recommended roles:
admin
manager
staff

Recommended dashboard calculations:
ads budget = sum(ads_plans.budget)
income = sum(finance.amount where type=Income)
expense = sum(finance.amount where type=Expense)
balance = income - expense
task progress = average(tasks.progress)
tenant count = count(tenants)
KOL count = count(influencers)
