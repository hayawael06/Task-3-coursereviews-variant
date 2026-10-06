import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'

const defaults = { courseCode: '', rating: 5, comment: '' }

export default function ReviewForm() {
  const nav = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState(defaults)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api.get(`/reviews/${id}`)
      .then((res) => {
        const { courseCode, rating, comment } = res.data
        setForm({
          courseCode: courseCode || '',
          rating: Number(rating) || 5,
          comment: comment || '',
        })
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to fetch review')
      })
  }, [id])

  function onChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === 'rating' ? Number(value) : value,
    }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      if (id) {
        await api.patch(`/reviews/${id}`, form)
      } else {
        await api.post('/reviews', form)
      }
      nav('/reviews')
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while saving')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 card">
      <h1 className="text-xl font-bold mb-4">{id ? 'Edit' : 'Write'} Review</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="courseCode"
            value={form.courseCode}
            onChange={onChange}
            placeholder="CS101"
            required
            className="input w-full"
          />
        </div>

        <div>
          <select
            name="rating"
            value={form.rating}
            onChange={onChange}
            className="input w-full"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} / 5
              </option>
            ))}
          </select>
        </div>

        <div>
          <textarea
            name="comment"
            value={form.comment}
            onChange={onChange}
            rows={3}
            placeholder="Great lectures and clear slides..."
            className="input w-full"
          />
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div>
          <button className="btn" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  )
}