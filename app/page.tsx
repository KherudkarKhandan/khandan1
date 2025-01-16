'use client'

import { useState } from 'react'
import FamilyTree from './components/FamilyTree'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import ThemeToggle from './components/ThemeToggle'
import { ThemeProvider } from './components/ThemeProvider'

interface Person {
  id: string
  name: string
  birthDate?: string
  deathDate?: string
  gender: 'male' | 'female'
  spouse?: Person
  children?: Person[]
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    // TODO: Implement search logic
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 dark:from-green-900 dark:via-green-800 dark:to-green-700">
        <Header>
          <SearchBar onSearch={handleSearch} />
          <ThemeToggle />
        </Header>
        <main className="flex-grow p-4">
          <FamilyTree
            searchTerm={searchTerm}
            selectedPerson={selectedPerson}
            setSelectedPerson={setSelectedPerson}
          />
        </main>
      </div>
    </ThemeProvider>
  )
}

