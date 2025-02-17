import * as merge from 'lodash.merge'
import query from '@ecomplus/search-engine/src/lib/dsl'

export default (self, term) => {
  const arr = (term || '').split(' ')
  const arrayLength = arr.length

  const fromTo = (arr) => {
    const newArr = arr.map(word => {
        const lower = word.toLowerCase()
        switch (lower) {
          case 'prateleiras':
            return 'prateleira'
          default:
            return lower
        }
    })
    return newArr.join(' ')
  }

  const listOfTerms = ['silicone', 'prateleira']
  if (!listOfTerms.includes(term)) {
    const sort = query.sort.slice()
    const relevanceSortIndex = sort.findIndex(s => s.ad_relevance)
    sort.splice(relevanceSortIndex, 1)
    self.dsl.sort = sort
  }

  const finalTerm = term
  self.mergeFilter({
    multi_match: {
      query: finalTerm,
      type: 'best_fields', // Usando best_fields
      fields: [
        'name',
        'keywords'
      ],
      operator: 'or' // Padrão: documentos podem corresponder a qualquer termo
      // operator: 'and' // Exige que todos os termos correspondam
    }
  }, 'must')
  
  merge(self.dsl, {
    suggest: {
      text: term,
      words: {
        term: {
          field: 'name'
        }
      }
    }
  })
  return self
}
