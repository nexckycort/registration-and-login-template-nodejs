import Joi from 'joi'
import { JoiAuthBearer } from 'api/middleware/validator'

export default {
  headers: Joi.object()
    .keys({
      authorization: JoiAuthBearer().required()
    })
    .unknown(true)
}
