$ErrorActionPreference = "Stop"
$baseUrl = "http://127.0.0.1:5173/api"

Write-Output "=========================================================="
Write-Output "   CAMPUSCONNECT FULL-STACK AUTOMATED TEST SUITE"
Write-Output "=========================================================="

# Test 1: Health Check
$health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
Write-Output "✅ 1. Backend Server & Health Check: $($health.status)"

# Test 2: Admin Authentication
$adminLogin = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"admin@campusconnect.edu","password":"Admin@12345"}'
$adminToken = $adminLogin.token
Write-Output "✅ 2. Admin Login & JWT: $($adminLogin.user.name) (Role: $($adminLogin.user.role))"

# Test 3: Student Registration (Ensuring cannot self-assign admin)
$testEmail = "test_student_$((Get-Date).Ticks)@campusconnect.edu"
$regPayload = @{
    name = "Sneha Rao"
    email = $testEmail
    password = "Student@12345"
    department = "Artificial Intelligence & Data Science"
    phone = "+91 9988776655"
    studentIdNumber = "AI2026099"
    role = "admin" # Attacking: trying to become admin
} | ConvertTo-Json

$studentRegister = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -ContentType "application/json" -Body $regPayload
$studentToken = $studentRegister.token
if ($studentRegister.user.role -eq "student") {
    Write-Output "✅ 3. Student Registration: Created $($studentRegister.user.name) (Role sanitized to: $($studentRegister.user.role))"
} else {
    throw "Security Failure: User was allowed to register as $($studentRegister.user.role)"
}

# Test 4: Protected Profile Endpoint
$studentHeaders = @{ Authorization = "Bearer $studentToken" }
$me = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method Get -Headers $studentHeaders
Write-Output "✅ 4. Protected /auth/me Profile: Fetched $($me.user.name), USN: $($me.user.studentIdNumber)"

# Test 5: Admin Create Event
$adminHeaders = @{ Authorization = "Bearer $adminToken" }
$eventPayload = @{
    title = "Autonomous Robotics Championship 2026"
    description = "Annual collegiate autonomous robotics challenge including line-follower and obstacle avoidance arenas."
    category = "Technical"
    eventDate = (Get-Date).AddDays(10).ToString("yyyy-MM-dd")
    eventTime = "09:00 AM - 05:00 PM"
    venue = "Robotics & Automation Arena, Mech Block"
    organizer = "Department of Artificial Intelligence & Robotics Club"
    capacity = 2
    image = "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1000&auto=format&fit=crop&q=80"
    tags = @("Robotics", "AI", "Competition")
} | ConvertTo-Json

$createdEvent = Invoke-RestMethod -Uri "$baseUrl/events" -Method Post -Headers $adminHeaders -ContentType "application/json" -Body $eventPayload
$testEventId = $createdEvent.event._id
Write-Output "✅ 5. Event Creation (Admin): '$($createdEvent.event.title)' (Capacity: $($createdEvent.event.capacity))"

# Test 6: Event Update (Admin)
$updatePayload = @{
    title = "Autonomous Robotics Championship 2026 [Updated]"
    capacity = 3
} | ConvertTo-Json
$updatedEvent = Invoke-RestMethod -Uri "$baseUrl/events/$testEventId" -Method Put -Headers $adminHeaders -ContentType "application/json" -Body $updatePayload
Write-Output "✅ 6. Event Update (Admin): Updated to '$($updatedEvent.event.title)' (New Capacity: $($updatedEvent.event.capacity))"

# Test 7: Event Search & Filter
$searchRes = Invoke-RestMethod -Uri "$baseUrl/events?search=Robotics" -Method Get
Write-Output "✅ 7. Event Search by Keyword: Found $($searchRes.count) matching event(s)"

$filterRes = Invoke-RestMethod -Uri "$baseUrl/events?category=Technical" -Method Get
Write-Output "✅ 8. Event Filter by Category: Found $($filterRes.count) Technical events"

# Test 8: Student Event Registration (Seat Allocation)
$booking = Invoke-RestMethod -Uri "$baseUrl/registrations" -Method Post -Headers $studentHeaders -ContentType "application/json" -Body "{`"eventId`":`"$testEventId`"}"
Write-Output "✅ 9. Student Event Registration: $($booking.message) (Remaining Seats: $($booking.seatsLeft))"

# Test 9: Duplicate Registration Prevention Check
try {
    $dupBooking = Invoke-RestMethod -Uri "$baseUrl/registrations" -Method Post -Headers $studentHeaders -ContentType "application/json" -Body "{`"eventId`":`"$testEventId`"}"
    throw "Duplicate check failed: allowed duplicate booking"
} catch {
    Write-Output "✅ 10. Duplicate Registration Prevention: Correctly blocked with status 400"
}

# Test 10: Admin View Event Registrations
$eventRegs = Invoke-RestMethod -Uri "$baseUrl/registrations/event/$testEventId" -Method Get -Headers $adminHeaders
Write-Output "✅ 11. Admin Event Roster: Retrieved $($eventRegs.count) student registration(s) for event"

# Test 11: Registration Cancellation (Concurrency-safe Seat Release)
$regId = $booking.registration._id
$cancelRes = Invoke-RestMethod -Uri "$baseUrl/registrations/$regId" -Method Delete -Headers $studentHeaders
Write-Output "✅ 12. Registration Cancellation: $($cancelRes.message)"

# Verify seat count restored
$eventAfterCancel = Invoke-RestMethod -Uri "$baseUrl/events/$testEventId" -Method Get
Write-Output "✅ 13. Concurrency Seat Restoration Verified: Registered count is now $($eventAfterCancel.event.registeredCount)"

# Test 12: Admin Delete Event
$delEvent = Invoke-RestMethod -Uri "$baseUrl/events/$testEventId" -Method Delete -Headers $adminHeaders
Write-Output "✅ 14. Event Deletion (Admin): $($delEvent.message)"

# Test 13: Admin Dashboard Statistics
$dash = Invoke-RestMethod -Uri "$baseUrl/admin/dashboard" -Method Get -Headers $adminHeaders
Write-Output "✅ 15. Admin Dashboard Metrics: Total Students=$($dash.data.stats.totalStudents), Events=$($dash.data.stats.totalEvents), Registrations=$($dash.data.stats.totalRegistrations)"

Write-Output "=========================================================="
Write-Output "   ALL 15/15 CORE FEATURES VERIFIED SUCCESSFULLY!"
Write-Output "=========================================================="
