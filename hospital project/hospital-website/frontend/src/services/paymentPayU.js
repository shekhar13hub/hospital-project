import crypto from 'crypto-js'

// PayU test credentials (from environment or hardcoded for demo)
const PAYU_MID = import.meta.env.VITE_PAYU_MID || '13411988'
const PAYU_SALT = import.meta.env.VITE_PAYU_SALT || 'xzfQiBqnkHJ8xobmcxq2yxc5CIm60atm'
const PAYU_TEST_URL = 'https://test.payumoney.com/mweb/'
const PAYU_PROD_URL = 'https://secure.payumoney.com/mweb/'

// Use mock mode by default for development (set VITE_PAYU_MOCK=false to use real PayU)
const PAYU_MOCK_MODE = import.meta.env.VITE_PAYU_MOCK !== 'false'

// Use test URL by default
const PAYU_URL = import.meta.env.VITE_PAYU_ENV === 'production' ? PAYU_PROD_URL : PAYU_TEST_URL

/**
 * Generate PayU hash for payment authentication
 * Hash format: SHA512(salt|key|param1|param2|...)
 * PayU requires: hash = SHA512(salt + key + txnid + amount + productinfo + firstname + email)
 */
export const generatePayUHash = (txnId, amount, productInfo, firstName, email) => {
  // Build the string to be hashed (salt + key + rest of params in order)
  const hashString = `${PAYU_SALT}|${PAYU_MID}|${txnId}|${amount}|${productInfo}|${firstName}|${email}`

  // Generate SHA512 hash using crypto-js
  const hash = crypto.SHA512(hashString).toString()
  return hash
}

/**
 * Initiate PayU payment checkout
 * In mock mode: Shows a test dialog and simulates payment
 * In real mode: Creates a form and submits it to PayU's hosted checkout page
 */
export const initiatePayUCheckout = (paymentDetails) => {
  const {
    txnId,
    amount,
    productInfo,
    firstName,
    email,
    phone,
    address,
    city,
    state,
    zipcode,
    country = 'India',
  } = paymentDetails

  // Generate hash
  const hash = generatePayUHash(txnId, amount, productInfo, firstName, email)

  // Mock mode: Simulate PayU checkout locally
  if (PAYU_MOCK_MODE) {
    return simulatePayUCheckout({
      txnId,
      amount,
      productInfo,
      firstName,
      email,
      phone,
      address,
      city,
      state,
      zipcode,
      country,
      hash,
    })
  }

  // Real mode: Create form and submit to PayU
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = PAYU_URL
  form.style.display = 'none'

  // Add required fields to form
  const fields = {
    key: PAYU_MID,
    txnid: txnId,
    amount: amount,
    productinfo: productInfo,
    firstname: firstName,
    email: email,
    phone: phone,
    address1: address || '',
    city: city || '',
    state: state || '',
    zipcode: zipcode || '',
    country: country,
    hash: hash,
    surl: `${window.location.origin}/book-success`, // Success redirect URL
    furl: `${window.location.origin}/book-failed`, // Failure redirect URL
    service_provider: 'payu_paisa',
  }

  // Append fields to form
  Object.keys(fields).forEach((key) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = key
    input.value = fields[key]
    form.appendChild(input)
  })

  // Append form to body and submit
  document.body.appendChild(form)
  form.submit()
}

/**
 * Simulate PayU checkout for local development/testing
 * Shows a dialog for user to approve/reject payment
 */
const simulatePayUCheckout = (paymentDetails) => {
  const { txnId, amount, firstName, email } = paymentDetails

  // Create a simple modal for testing
  const userChoice = window.confirm(
    `🧪 PayU Mock Mode (Test)\n\nTransaction ID: ${txnId}\nAmount: ₹${amount}\nName: ${firstName}\nEmail: ${email}\n\nClick OK to simulate successful payment, or Cancel to simulate failure.`
  )

  if (userChoice) {
    // Simulate success: redirect to success page after a short delay
    setTimeout(() => {
      const successParams = new URLSearchParams({
        status: 'success',
        txnid: txnId,
        amount: amount,
        firstname: firstName,
        email: email,
        productinfo: paymentDetails.productInfo,
        hash: paymentDetails.hash,
      })
      window.location.href = `${window.location.origin}/book-success?${successParams.toString()}`
    }, 1000)
  } else {
    // Simulate failure: redirect to failure page after a short delay
    setTimeout(() => {
      const failureParams = new URLSearchParams({
        status: 'failed',
        txnid: txnId,
        amount: amount,
        firstname: firstName,
        email: email,
        error: 'Payment declined in mock mode',
      })
      window.location.href = `${window.location.origin}/book-failed?${failureParams.toString()}`
    }, 1000)
  }
}

/**
 * Verify PayU payment response (server-side ideally, but can do client-side for demo)
 * This should be called after PayU redirects back with payment response
 */
export const verifyPayUResponse = (response) => {
  // response should contain: status, txnid, amount, hash, etc.
  if (!response || !response.hash) {
    return false
  }

  // Reconstruct the hash to verify
  const verificationString = `${PAYU_SALT}|${response.status}|${response.txnid}|${response.amount}|${response.productinfo}|${response.firstname}|${response.email}`
  const expectedHash = crypto.SHA512(verificationString).toString()

  // Compare hashes
  return response.hash === expectedHash
}

export default {
  generatePayUHash,
  initiatePayUCheckout,
  verifyPayUResponse,
  PAYU_MID,
  PAYU_URL,
}
